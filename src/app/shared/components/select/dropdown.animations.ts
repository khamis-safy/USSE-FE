import { animate, state, style, transition, trigger } from "@angular/animations";

export const DropdownAnimations = {
	fadeSlideY: trigger('fadeSlideY', [
		state(
			'void',
			style({
				opacity: 0,
				transform: 'translateY(30px)'
			})
		),
		transition('void <=> *', [animate('.2s')])
	]),
	fade: trigger('fade', [
		state(
			'void',
			style({
				opacity: 0
			})
		),
		transition('void <=> *', [animate('.2s')])
	])
};