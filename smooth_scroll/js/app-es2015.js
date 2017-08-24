/**
 * イージング関数を取得
 * @param {string} name イージング名
 */
const getEasingFunc = (name) => {
	switch (name) {
		case 'linear':
			return (t, b, c, d) => {
				return c * t / d + b;
			}
			break;

			// easeIn
		case 'easeInQuad':
			return (t, b, c, d) => {
				t /= d;
				return c * t * t + b;
			};
			break;
		case 'easeInCubic':
			return (t, b, c, d) => {
				t /= d;
				return c * t * t * t + b;
			}
			break;
		case 'easeInQuart':
			return (t, b, c, d) => {
				t /= d;
				return c * t * t * t * t + b;
			}
			break;
		case 'easeInQuint':
			return (t, b, c, d) => {
				t /= d;
				return c * t * t * t * t * t + b;
			}
			break;
		case 'easeInSine':
			return (t, b, c, d) => {
				return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
			}
			break;
		case 'easeInExpo':
			return (t, b, c, d) => {
				return c * Math.pow(2, 10 * (t / d - 1)) + b;
			}
			break;
		case 'easeInCirc':
			return (t, b, c, d) => {
				t /= d;
				return -c * (Math.sqrt(1 - t * t) - 1) + b;
			}
			break;

			// easeOut
		case 'easeOutQuad':
			return (t, b, c, d) => {
				t /= d;
				return -c * t * (t - 2) + b;
			}
			break;
		case 'easeOutCubic':
			return (t, b, c, d) => {
				t /= d;
				t--;
				return c * (t * t * t + 1) + b;
			}
			break;
		case 'easeOutQuart':
			return (t, b, c, d) => {
				t /= d;
				t--;
				return -c * (t * t * t * t - 1) + b;
			}
			break;
		case 'easeOutQuint':
			return (t, b, c, d) => {
				t /= d;
				t--;
				return c * (t * t * t * t * t + 1) + b;
			}
			break;
		case 'easeOutSine':
			return (t, b, c, d) => {
				return c * Math.sin(t / d * (Math.PI / 2)) + b;
			}
			break;
		case 'easeOutExpo':
			return (t, b, c, d) => {
				return c * (-Math.pow(2, -10 * t / d) + 1) + b;
			}
			break;
		case 'easeOutCirc':
			return (t, b, c, d) => {
				t /= d;
				t--;
				return c * Math.sqrt(1 - t * t) + b;
			}
			break;

			// easeInOut
		case 'easeInOutQuad':
			return (t, b, c, d) => {
				t /= d / 2;
				if (t < 1) return c / 2 * t * t + b;
				t--;
				return -c / 2 * (t * (t - 2) - 1) + b;
			}
			break;
		case 'easeInOutCubic':
			return (t, b, c, d) => {
				t /= d / 2;
				if (t < 1) return c / 2 * t * t * t + b;
				t -= 2;
				return c / 2 * (t * t * t + 2) + b;
			}
			break;
		case 'easeInOutQuart':
			return (t, b, c, d) => {
				t /= d / 2;
				if (t < 1) return c / 2 * t * t * t * t + b;
				t -= 2;
				return -c / 2 * (t * t * t * t - 2) + b;
			}
			break;
		case 'easeInOutQuint':
			return (t, b, c, d) => {
				t /= d / 2;
				if (t < 1) return c / 2 * t * t * t * t * t + b;
				t -= 2;
				return c / 2 * (t * t * t * t * t + 2) + b;
			}
			break;
		case 'easeInOutSine':
			return (t, b, c, d) => {
				return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
			}
			break;
		case 'easeInOutExpo':
			return (t, b, c, d) => {
				t /= d / 2;
				if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
				t--;
				return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
			}
			break;
		case 'easeInOutCirc':
			return (t, b, c, d) => {
				t /= d / 2;
				if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
				t -= 2;
				return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
			}
			break;

			// デフォルトはlinear
		default:
			return (t, b, c, d) => {
				return c * t / d + b;
			}
			break;
	}
}

class SmScroll {
	constructor(option) {
		this.option = {
			trigger: 'a', // イベント発火となるセレクタ
			attr: 'href', // リンク先を示す属性値
			prefixOverRide: 'data-smScroll-', // オプションを上書きするカスタムデータ属性名
			duration: 600, // アニメーション完了までの時間（ミリ秒）
			positioning: 0, // 遷移先位置の調整値
			easing: 'easeOutQuart', // イージング名
			beforeFunc: null, // スクロール開始前の実行する関数
			afterFunc: null // スクロール完了後に実行する関数
		};
		this.baseElement = null;

		// オプションのマージ
		Object.assign(this.option, option);

		// 最初のオプション値をコピー
		this.firstOption = Object.assign({}, this.option);
	}

	/**
	 * 初期設定・実行
	 */
	init() {
		const triggers = document.querySelectorAll(this.option.trigger);
		if (triggers.length < 1) {
			return;
		}
		// 現在地と遷移先のスクロール位置のオブジェクト定義
		const posScroll = {
			from: null,
			to: null
		};

		/**
		 * 属性値からオプション設定を上書き
		 * @param {Node} target 属性値を持った要素
		 */
		const overRideOptionFromAttr = (target) => {
			const ary = ['duration', 'positioning', 'easing'];
			const option = this.option;
			const prefixOverRide = option.prefixOverRide;

			ary.forEach((v) => {
				if (target.getAttribute(prefixOverRide + v)) {
					option[v] = target.getAttribute(prefixOverRide + v);
				}
			});
		};

		// webkit系であれば位置情報の取得をbody要素から、その他はhtml要素から行う
		this.baseElement = (() => {
			const webkitFlg = navigator.userAgent.toLowerCase().match(/webkit/) ? true : false;
			return webkitFlg ? document.body : document.documentElement;
		})();

		// トリガークリック時のイベント設定
		Object.keys(triggers).forEach((v) => {
			triggers[v].addEventListener('click', (e) => {
				// ターゲット要素取得
				const attrStr = e.currentTarget.getAttribute(this.option.attr).substr('1');
				const target  = document.getElementById(attrStr);
				if (attrStr === '' || !target) {
					return;
				}

				e.preventDefault();

				// 属性値からオプション設定を上書き
				overRideOptionFromAttr(e.currentTarget);

				// 遷移先のスクロール位置調整の値設定
				const positioning = ((pos) => {
					// 関数であれば実行し、それ以外は数値として返す
					if (typeof pos === 'function') {
						return pos();
					} else {
						return parseInt(pos, 10);
					}
				})(this.option.positioning);

				// 現在地と遷移先のスクロール位置取得
				posScroll.from = this.baseElement.scrollTop;
				posScroll.to = (() => {
					const clientRect = target.getBoundingClientRect();
					return this.baseElement.scrollTop + clientRect.top + positioning;
				})();

				// スクロール開始前の関数が設定されていた場合、実行
				if (typeof this.option.beforeFunc === 'function') {
					this.option.beforeFunc();
				}

				// スクロール実行
				this.move(posScroll);
			});
		});
	}

	/**
	 * スクロール実行
	 * @param {object} offsetTop
	 * 	offsetTop.nowに現在地、offsetTop.tagetに遷移先のスクロール位置を設定
	 */
	move(posScroll) {
		const startTime     = Date.now(); // 開始時間
		const duration      = this.option.duration; // 継続時間
		const posScrollFrom = posScroll.from; // 初期位置
		const posScrollTo   = posScroll.to < 0 ? 0 : posScroll.to; // 終了位置（マイナスになるとアニメーション完了のconst生じるのでマイナス時には0を代入）
		const changeVal     = posScrollTo - posScrollFrom; // 変動値
		const easing        = getEasingFunc(this.option.easing); // イージング関数
		let myReq           = null; // requestAnimationFrameID用

		/**
		 * スクロールアニメーション
		 */
		const scrollAnime = () => {
			let currentTime = Date.now() - startTime; // 経過時間
			let pos         = posScrollFrom; // スクロール位置

			if (currentTime > duration) {
				// タイミングによって最後の位置が変わるのでスクロール完了時に目的の位置にスクロールさせる
				scrollTo(0, posScrollTo);

				cancelAnimationFrame(myReq);

				// 上書きされたオプション設定を初期値に戻す
				this.option = Object.assign({}, this.firstOption);

				// スクロール終了後の関数が設定されていた場合、実行
				if (typeof this.option.afterFunc === 'function') {
					setTimeout(this.option.afterFunc);
				}
				return;
			}

			// スクロール位置設定
			pos = easing(currentTime, posScrollFrom, changeVal, duration);
			scrollTo(0, pos);
			myReq = requestAnimationFrame(scrollAnime);
		};

		myReq = requestAnimationFrame(scrollAnime);
	}
}

/**
 * 実行
 */
const smScroll = new SmScroll();
smScroll.init();

const smScroll2 = new SmScroll({
	trigger: 'span',
	attr: 'data-scroll',
	duration: 300,
	positioning: () => {
		return -document.getElementById('nav').clientHeight;
	},
	easing: 'easeInExpo',
	beforeFunc: () => {
		alert('scroll start!');
	},
	afterFunc: () => {
		alert('scroll end!');
	}
});
smScroll2.init();