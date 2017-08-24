'use strict';

/**
 * Object.assign() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
 */
if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

/**
 * イージング関数を取得
 * @param {string} name イージング名
 */
var getEasingFunc = function(name) {
	switch (name) {
		case 'linear':
			return function(t, b, c, d) {
				return c * t / d + b;
			}
			break;

		// easeIn
		case 'easeInQuad':
			return function(t, b, c, d) {
				t /= d;
				return c * t * t + b;
			};
			break;
		case 'easeInCubic':
			return function(t, b, c, d) {
				t /= d;
				return c * t * t * t + b;
			}
			break;
		case 'easeInQuart':
			return function(t, b, c, d) {
				t /= d;
				return c * t * t * t * t + b;
			}
			break;
		case 'easeInQuint':
			return function(t, b, c, d) {
				t /= d;
				return c * t * t * t * t * t + b;
			}
			break;
		case 'easeInSine':
			return function(t, b, c, d) {
				return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
			}
			break;
		case 'easeInExpo':
			return function(t, b, c, d) {
				return c * Math.pow(2, 10 * (t / d - 1)) + b;
			}
			break;
		case 'easeInCirc':
			return function(t, b, c, d) {
				t /= d;
				return -c * (Math.sqrt(1 - t * t) - 1) + b;
			}
			break;

		// easeOut
		case 'easeOutQuad':
			return function(t, b, c, d) {
				t /= d;
				return -c * t * (t - 2) + b;
			}
			break;
		case 'easeOutCubic':
			return function(t, b, c, d) {
				t /= d;
				t--;
				return c * (t * t * t + 1) + b;
			}
			break;
		case 'easeOutQuart':
			return function(t, b, c, d) {
				t /= d;
				t--;
				return -c * (t * t * t * t - 1) + b;
			}
			break;
		case 'easeOutQuint':
			return function(t, b, c, d) {
				t /= d;
				t--;
				return c * (t * t * t * t * t + 1) + b;
			}
			break;
		case 'easeOutSine':
			return function(t, b, c, d) {
				return c * Math.sin(t / d * (Math.PI / 2)) + b;
			}
			break;
		case 'easeOutExpo':
			return function(t, b, c, d) {
				return c * (-Math.pow(2, -10 * t / d) + 1 ) + b;
			}
			break;
		case 'easeOutCirc':
			return function(t, b, c, d) {
				t /= d;
				t--;
				return c * Math.sqrt(1 - t * t) + b;
			}
			break;

		// easeInOut
		case 'easeInOutQuad':
			return function(t, b, c, d) {
				t /= d/2;
				if (t < 1) return c/2*t*t + b;
				t--;
				return -c/2 * (t*(t-2) - 1) + b;
			}
			break;
		case 'easeInOutCubic':
			return function(t, b, c, d) {
				t /= d/2;
				if (t < 1) return c / 2 * t * t * t + b;
				t -= 2;
				return c / 2 * (t * t * t  + 2) + b;
			}
			break;
		case 'easeInOutQuart':
			return function(t, b, c, d) {
				t /= d / 2;
				if (t < 1) return c / 2 * t * t * t * t + b;
				t -= 2;
				return -c / 2 * (t * t * t * t - 2) + b;
			}
			break;
		case 'easeInOutQuint':
			return function(t, b, c, d) {
				t /= d / 2;
				if (t < 1) return c / 2 * t * t * t * t * t + b;
				t -= 2;
				return c / 2 * (t * t * t * t * t + 2) + b;
			}
			break;
		case 'easeInOutSine':
			return function (t, b, c, d) {
				return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
			}
			break;
		case 'easeInOutExpo':
			return function (t, b, c, d) {
				t /= d / 2;
				if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
				t--;
				return c / 2 * (-Math.pow(2, -10 * t) + 2 ) + b;
			}
			break;
		case 'easeInOutCirc':
			return function (t, b, c, d) {
				t /= d / 2;
				if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
				t -= 2;
				return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
			}
			break;

		// デフォルトはlinear
		default:
			return function (t, b, c, d) {
				return c * t / d + b;
			}
			break;
	}
}

/**
 * スムーススクロール
 * @constructor
 * @param {object} option オプション設定
 */
var SmScroll = function(option) {
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
};

/**
 * 初期設定・実行
 */
SmScroll.prototype.init = function() {
	var self     = this;
	var triggers = document.querySelectorAll(self.option.trigger);
	if (triggers.length < 1) {
		return;
	}
	// 現在地と遷移先のスクロール位置のオブジェクト定義
	var posScroll = {
		from: null,
		to: null
	};

	/**
	 * 属性値からオプション設定を上書き
	 * @param {Node} target 属性値を持った要素
	 */
	var overRideOptionFromAttr = function(target) {
		var ary = ['duration', 'positioning', 'easing'];
		var selfOption = self.option;
		var prefixOverRide = selfOption.prefixOverRide;

		ary.forEach(function(v) {
			if (target.getAttribute(prefixOverRide + v)) {
				selfOption[v] = target.getAttribute(prefixOverRide + v);
			}
		});
	};

	// webkit系であれば位置情報の取得をbody要素から、その他はhtml要素から行う
	self.baseElement = (function() {
		var webkitFlg = navigator.userAgent.toLowerCase().match(/webkit/) ? true : false;
		return webkitFlg ? document.body : document.documentElement;
	})();

	// トリガークリック時のイベント設定
	Object.keys(triggers).forEach(function(v) {
		triggers[v].addEventListener('click', function(e) {
			// ターゲット要素取得
			var attrStr = this.getAttribute(self.option.attr).substr('1');
			var target  = document.getElementById(attrStr);
			if (attrStr === '' || !target) {
				return;
			}

			e.preventDefault();

			// 属性値からオプション設定を上書き
			overRideOptionFromAttr(this);

			// 遷移先のスクロール位置調整の値設定
			var positioning = (function(pos) {
				// 関数であれば実行し、それ以外は数値として返す
				if (typeof pos === 'function') {
					return pos();
				} else {
					return parseInt(pos, 10);
				}
			})(self.option.positioning);


			// 現在地と遷移先のスクロール位置取得
			posScroll.from = self.baseElement.scrollTop;
			posScroll.to = (function() {
				var clientRect = target.getBoundingClientRect();
				return self.baseElement.scrollTop + clientRect.top + positioning;
			})();

			// スクロール開始前の関数が設定されていた場合、実行
			if (typeof self.option.beforeFunc === 'function') {
				self.option.beforeFunc();
			}

			// スクロール実行
			self.move(posScroll);
		});
	});
};

/**
 * スクロール実行
 * @param {object} offsetTop
 * 	offsetTop.nowに現在地、offsetTop.tagetに遷移先のスクロール位置を設定
 */
SmScroll.prototype.move = function(posScroll) {
	var self          = this;
	var startTime     = Date.now(); // 開始時間
	var duration      = self.option.duration; // 継続時間
	var posScrollFrom = posScroll.from; // 初期位置
	var posScrollTo   = posScroll.to < 0 ? 0 : posScroll.to; // 終了位置（マイナスになるとアニメーション完了の時差が生じるのでマイナス時には0を代入）
	var changeVal     = posScrollTo - posScrollFrom; // 変動値
	var easing        = getEasingFunc(self.option.easing); // イージング関数
	var myReq         = null; // requestAnimationFrameID用

	/**
	 * スクロールアニメーション
	 */
	var scrollAnime = function() {
		var currentTime = Date.now() - startTime; // 経過時間
		var pos         = posScrollFrom; // スクロール位置

		if (currentTime > duration) {
			// タイミングによって最後の位置が変わるのでスクロール完了時に目的の位置にスクロールさせる
			scrollTo(0, posScrollTo);

			cancelAnimationFrame(myReq);

			// 上書きされたオプション設定を初期値に戻す
			self.option = Object.assign({}, self.firstOption);

			// スクロール終了後の関数が設定されていた場合、実行
			if (typeof self.option.afterFunc === 'function') {
				setTimeout(self.option.afterFunc);
			}
			return;
		}

		// スクロール位置設定
		pos = easing(currentTime, posScrollFrom, changeVal, duration);
		scrollTo(0, pos);
		myReq = requestAnimationFrame(scrollAnime);
	};

	myReq = requestAnimationFrame(scrollAnime);
};

/**
 * 実行
 */
const smScroll = new SmScroll();
smScroll.init();

const smScroll2 = new SmScroll({
	trigger: 'span',
	attr: 'data-scroll',
	duration: 300,
	positioning: function() {
		return -document.getElementById('nav').clientHeight;
	},
	easing: 'easeInExpo',
	beforeFunc: function() {
		alert('scroll start!');
	},
	afterFunc: function() {
		alert('scroll end!');
	}
});
smScroll2.init();
