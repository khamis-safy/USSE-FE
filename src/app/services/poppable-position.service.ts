import { Injectable, ElementRef } from '@angular/core';

export interface PoppableStyles {
  position?: string;
  top?: string;
  bottom?: string;
  left?: string;
  transform?: string;
  maxWidth?: string;
  opacity?: number;
  zIndex?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PoppablePositionService {
  /* -------------------------------------------------------------------------------
  The logic here is as follow:

  * If "boundary" is specified, all calculations will be based off that, if not, calculations will be based off document.

  1- Since we don't know the poppable width, we have to put it on the document first with the following:
      A- left: -1000px to keep poppable off screen (necessary since we don't yet know its width)
      B- opacity = 0 to hide the poppable while calculating its position.


  2- center position if poppable doesn't overflow in either direction or overflows in both direction.

  3- left position if poppable overflows to the right with a center position and doesn't overflow to the right with a left position

  4- right position if poppable overflows to the left with a center position and doesn't overflow to the left with a right position

  5- top position if poppable doesn't overflow to the top and is still visible in view,

  6- bottom position otherwise.


  * Adding a position:fixed option because if the parent div has overflow:hidden or overflow:scroll, the poppable will be cut off in the first
    and cause scroll bars in the second. The position:absolute approach works fine only if the parent has overflow:visible.
  -------------------------------------------------------------------------------  */

  public resetStyles(maxWidth: string) {
    const poppableStyle = {
      position: 'fixed',
      left: '-1000px',
      top: '0px',
      maxWidth: maxWidth,
      opacity: 0,
    };
    const beakStyle = {
      position: 'fixed',
      left: '-1000px',
      maxWidth: maxWidth,
      opacity: 0,
    };

    return { poppableStyle, beakStyle };
  }

  public getStyles(
    parent: ElementRef | undefined,
    poppable: ElementRef | undefined,
    beak: ElementRef | undefined,
    boundary: string,
    maxWidth: string
  ) {
    // Get elements sizes and positions
    const { parentRect, poppableRect, beakRect, boundaryRect } =
      this.getElementsBoundingRects(parent, poppable, beak, boundary);

    return this.calculatePosition(
      parentRect,
      poppableRect,
      beakRect,
      boundaryRect,
      maxWidth
    );
  }

  /*
  -------------------------------------------------------------------------------
  -------------------------------------------------------------------------------
  Helpers
  -------------------------------------------------------------------------------
  -------------------------------------------------------------------------------
  */
  private getElementsBoundingRects(
    parent: ElementRef | undefined,
    poppable: ElementRef | undefined,
    beak: ElementRef | undefined,
    boundary: string
  ) {
    const parentRect = parent?.nativeElement.getBoundingClientRect();

    const poppableRect = poppable?.nativeElement.getBoundingClientRect();

    const beakRect = beak?.nativeElement.getBoundingClientRect();

    let boundaryRect;

    // set the document to be the boundary if boundary element wasn't passed or doesn't exist
    if (boundary && document.querySelector(boundary)) {
      boundaryRect = document.querySelector(boundary)?.getBoundingClientRect();
    } else {
      boundaryRect = document.documentElement.getBoundingClientRect();
    }

    return { parentRect, poppableRect, beakRect, boundaryRect };
  }

  private calculatePosition(
    parentRect: any,
    poppableRect: any,
    beakRect: any,
    boundaryRect: any,
    maxWidth: string
  ) {
    const poppableStyle: PoppableStyles = {
      position: 'fixed',
      maxWidth: maxWidth,
      zIndex: 1050, // modal component has 1040 z-index .. we need to set a clear hierarchy to avoid conflicts
    };

    const beakStyle: PoppableStyles = {
      position: 'fixed',
      maxWidth: maxWidth,
      zIndex: 1050, // modal component has 1040 z-index .. we need to set a clear hierarchy to avoid conflicts
      transform: 'translateX(-50%)',
    };

    /*
    ----------------------------------------------------
    ---------------------- CENTER ------------------------
    ----------------------------------------------------
    */
    if (
      ((poppableRect.width - parentRect.width) / 2 <= // won't overflow to the left with a center position
        parentRect.left - boundaryRect.left &&
        (poppableRect.width - parentRect.width) / 2 <= // won't overflow to the right with center position
          boundaryRect.right - parentRect.right) ||
      boundaryRect.width <= poppableRect.width // will overflow in both directions
    ) {
      poppableStyle.left = `${parentRect.left + parentRect.width / 2}px`;

      poppableStyle.transform = 'translateX(-50%)';

      beakStyle.left = `${parentRect.left + parentRect.width / 2}px`;
    } else if (
      /*
    ----------------------------------------------------
    ---------------------- lEFT ------------------------
    ----------------------------------------------------
    */
      poppableRect.width - parentRect.width <= // won't overflow to the right with left position
      boundaryRect.right - parentRect.left
    ) {
      poppableStyle.left = `${parentRect.left - 5}px`; // add 5px to give the beak some space

      beakStyle.left = `${parentRect.left + parentRect.width / 2}px`;
    } else if (
      /*
    ----------------------------------------------------
    ---------------------- RIGHT ------------------------
    ----------------------------------------------------
    */
      poppableRect.width - parentRect.width <= // won't overflow to the left with a right position
      parentRect.right - boundaryRect.left
    ) {
      poppableStyle.left = `${parentRect.right - poppableRect.width + 5}px`; // add 5px to give the beak some space

      beakStyle.left = `${parentRect.right - parentRect.width / 2}px`;
    }

    /*
    ----------------------------------------------------
    ----------------------- TOP ------------------------
    ----------------------------------------------------
    */
    if (
      poppableRect.height + beakRect.height <=
        parentRect.top - boundaryRect.top && // if poppable + beak height won't cause an overflow
      parentRect.top - poppableRect.height - beakRect.height >= 0 // and poppable would show in view
    ) {
      poppableStyle.top = `${
        parentRect.top - poppableRect.height - beakRect.height
      }px`;

      beakStyle.top = `${parentRect.top - beakRect.height - 1}px`;

      beakStyle.transform = beakStyle.transform + 'rotate(0deg)';
      /*
      ----------------------------------------------------
      --------------------- BOTTOM -----------------------
      ----------------------------------------------------
     */
    } else {
      poppableStyle.top = `${
        parentRect.top + parentRect.height + beakRect.height
      }px`;

      beakStyle.top = `${parentRect.top + parentRect.height + 1}px`;

      beakStyle.transform = beakStyle.transform + 'rotate(180deg)';
    }

    return { poppableStyle, beakStyle };
  }
}
