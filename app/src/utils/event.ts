import { afterAll, beforeAll, vi } from 'vitest';

export function installPointerEvent() {
	beforeAll(() => {
		// @ts-ignore
		vi.stubGlobal(
			'PointerEvent',
			class FakePointerEvent extends MouseEvent {
				_init: {
					pageX: number;
					pageY: number;
					pointerType: string;
					pointerId: number;
					width: number;
					height: number;
				};

				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				constructor(name: any, init: any) {
					super(name, init);
					this._init = init;
				}

				get pointerType() {
					return this._init.pointerType;
				}

				get pointerId() {
					return this._init.pointerId;
				}

				get pageX() {
					return this._init.pageX;
				}

				get pageY() {
					return this._init.pageY;
				}

				get width() {
					return this._init.width;
				}

				get height() {
					return this._init.height;
				}
			},
		);
	});

	afterAll(() => {
		// @ts-ignore
		global.PointerEvent = undefined;
	});
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function createPointerEvent(type: any, opts: any) {
	const evt = new Event(type, { bubbles: true, cancelable: true });
	Object.assign(
		evt,
		{
			ctrlKey: false,
			metaKey: false,
			shiftKey: false,
			altKey: false,
			button: opts.button || 0,
			width: 1,
			height: 1,
		},
		opts,
	);
	return evt;
}
