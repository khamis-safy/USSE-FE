import { trigger, transition, style, query, animateChild, group, animate } from '@angular/animations';
export const routeTransitionAnimations =
trigger('routeAnimations', [
  transition('* <=> *', [
    style({
      position: 'relative',
      height:'fit-content',
      display: 'block',
    }),
    query(':enter', [
      style({
        display: 'block',
        width:'100%',
        position: 'relative',
        opacity: 0,
        transform: 'scale(0.95)'
      })
    ] ,{ optional: true }),
    query(':leave', [
      style({
        width:'100%',
        position: 'absolute',
        display: 'block',
        opacity: 1,
        transform: 'scale(1)'
      })
    ] ,{ optional: true }),
    query(':leave', [
      animate('600ms ease', style({
        display: 'block',
        opacity: 0, transform: 'scale(1.05)'
      })),
    ] ,{ optional: true }),
    query(':leave', animateChild() ,{ optional: true }),
    query(':enter', [
      animate('600ms ease', style({
        display: 'block',
        position: 'relative',
        opacity: 1,
        transform: 'scale(1)',
      })),
    ] ,{ optional: true })
  ]),
]);
