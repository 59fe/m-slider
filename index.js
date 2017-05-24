'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Frame = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("./index.less");
var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _PropTypes = require('prop-types');

var _PropTypes2 = _interopRequireDefault(_PropTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _getTransitionEnd = require('m-base/js/getTransitionEnd');

var _getTransitionEnd2 = _interopRequireDefault(_getTransitionEnd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RESISTANCE_COEFFICIENT = 1000;
var PRE_CLS = 'slider';
var FRAME_CLS = PRE_CLS + '-frame';
var VELOCITY_FORCE = 300;

var Swipable = function (_Component) {
    _inherits(Swipable, _Component);

    function Swipable(props) {
        _classCallCheck(this, Swipable);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Swipable).call(this, props));

        _this.state = {
            x: null,
            y: null,
            swiping: false,
            start: 0
        };
        return _this;
    }

    _createClass(Swipable, [{
        key: 'calculatePos',
        value: function calculatePos(e) {
            var x = e.changedTouches[0].clientX;
            var y = e.changedTouches[0].clientY;

            var xd = this.state.x - x;
            var yd = this.state.y - y;

            var axd = Math.abs(xd);
            var ayd = Math.abs(yd);

            return {
                deltaX: xd,
                deltaY: yd,
                absX: axd,
                absY: ayd
            };
        }
    }, {
        key: 'touchStart',
        value: function touchStart(e) {
            if (e.touches.length > 1) {
                return;
            }
            this.setState({
                start: Date.now(),
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                swiping: false
            });
        }
    }, {
        key: 'touchMove',
        value: function touchMove(e) {
            if (!this.state.x || !this.state.y || e.touches.length > 1) {
                return;
            }

            //阻止页面滑动
            var cancelPageSwipe = false;
            var pos = this.calculatePos(e);

            if (pos.absX < this.props.delta && pos.absY < this.props.delta) {
                return;
            }

            if (this.props.onSwiping) {
                this.props.onSwiping(e, pos.deltaX, pos.deltaY, pos.absX, pos.absY);
            }

            if (pos.absX > pos.absY) {
                if (pos.deltaX > 0) {
                    if (this.props.onSwipingLeft) {
                        this.props.onSwipingLeft(e, pos.deltaX, pos.deltaY, pos.absX, pos.absY);
                        cancelPageSwipe = true;
                    }
                } else {
                    if (this.props.onSwipingRight) {
                        this.props.onSwipingRight(e, pos.deltaX, pos.deltaY, pos.absX, pos.absY);
                        cancelPageSwipe = true;
                    }
                }
            } else {
                if (pos.deltaY > 0) {
                    if (this.props.onSwipingUp) {
                        this.props.onSwipingUp(e, pos.absY);
                        cancelPageSwipe = true;
                    }
                } else {
                    if (this.props.onSwipingDown) {
                        this.props.onSwipingDown(e, pos.absY);
                        cancelPageSwipe = true;
                    }
                }
            }

            this.setState({ swiping: true });
            if (cancelPageSwipe) {
                e.preventDefault();
            }
        }
    }, {
        key: 'touchEnd',
        value: function touchEnd(ev) {
            if (this.state.swiping) {
                var pos = this.calculatePos(ev);

                var time = Date.now() - this.state.start;
                var velocity = Math.sqrt(pos.absX * pos.absX + pos.absY * pos.absY) / time;
                var isFlick = velocity > this.props.flickThreshold;

                this.props.onSwiped && this.props.onSwiped(ev, pos.deltaX, pos.deltaY, isFlick);

                if (pos.absX > pos.absY) {
                    if (pos.deltaX > 0) {
                        this.props.onSwipedLeft && this.props.onSwipedLeft(velocity);
                    } else {
                        this.props.onSwipedRight && this.props.onSwipedRight(velocity);
                    }
                } else {
                    if (pos.deltaY > 0) {
                        this.props.onSwipedUp && this.props.onSwipedUp(ev, pos.deltaY, isFlick);
                    } else {
                        this.props.onSwipedDown && this.props.onSwipedDown(ev, pos.deltaY, isFlick);
                    }
                }
            }

            this.setState({
                x: null,
                y: null,
                swiping: false,
                start: 0
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                _extends({}, this.props, {
                    onTouchStart: this.touchStart.bind(this),
                    onTouchMove: this.touchMove.bind(this),
                    onTouchEnd: this.touchEnd.bind(this) }),
                this.props.children
            );
        }
    }]);

    return Swipable;
}(_react.Component);

Swipable.propTypes = {
    onSwiped: _react.PropTypes.func,
    onSwiping: _react.PropTypes.func,
    onSwipingUp: _react.PropTypes.func,
    onSwipingRight: _react.PropTypes.func,
    onSwipingDown: _react.PropTypes.func,
    onSwipingLeft: _react.PropTypes.func,
    onSwipedUp: _react.PropTypes.func,
    onSwipedRight: _react.PropTypes.func,
    onSwipedDown: _react.PropTypes.func,
    onSwipedLeft: _react.PropTypes.func,
    flickThreshold: _react.PropTypes.number,
    delta: _react.PropTypes.number
};

Swipable.defaultProps = {
    flickThreshold: 0.6,
    delta: 10
};

var Slider = function (_Component2) {
    _inherits(Slider, _Component2);

    function Slider(props) {
        _classCallCheck(this, Slider);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Slider).call(this, props));

        var state = {
            current: 0,
            tending: 0,
            delta: 0,
            offset: 0,
            preLoad: props.narrow ? 2 : 1,
            onVelocity: false,
            reset: false
        };

        //普通模式,或组合模式
        if (props.images) {
            var images = _this2.refineImages(props.images, props.group);
            state.frames = images;
            state.length = images.length;
        } else {
            state.frames = props.children;
            state.length = props.children.length;
        }

        _this2.state = state;
        return _this2;
    }

    _createClass(Slider, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this3 = this;

            var freeMode = this.props.freeMode;

            var content = _reactDom2.default.findDOMNode(this.refs.content);
            this.content = content;
            content.addEventListener(_getTransitionEnd2.default, function (e) {
                var _state = _this3.state;
                var current = _state.current;
                var tending = _state.tending;
                var length = _state.length;
                var offset = _state.offset;

                if (current != tending) {
                    _this3.setState({
                        current: _this3.state.tending
                    });
                }
            });

            var _props = this.props;
            var auto = _props.auto;
            var interval = _props.interval;

            if (auto) {
                //定时触发
                this.setAutoPlay(interval);
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.cancelAutoPlay();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var loop = nextProps.loop;
            var images = nextProps.images;
            var group = nextProps.group;
            var auto = nextProps.auto;
            var freeMode = nextProps.freeMode;
            var interval = nextProps.interval;
            var current = nextProps.current;
            var narrow = nextProps.narrow;

            var state = null,
                frames = null;

            //是否是组合类型
            if (images) {
                frames = this.refineImages(images, group);
            } else {
                frames = nextProps.children;
            }
            state = {
                frames: frames,
                length: frames.length,
                reset: true
            };

            if (current) {
                state.current = current;
            }

            //循环模式下, 约束 current index 值
            if (!loop) {
                state.current = this._limit(this.state.current, frames.length);
                state.tending = this._limit(this.state.tending, frames.length);
            } else {
                if (narrow) {
                    state.preLoad = 2;
                } else {
                    state.preLoad = 1;
                }
            }
            //跟随模式下, 限制offset值, 仿制因分组导致offset值超出范围
            if (freeMode && group !== this.props.group) {
                state.offset = this._getMinOffset(this.state.offset, nextProps, state);
            }
            //设置自动播放
            if (auto) {
                this.setAutoPlay(interval, auto, freeMode);
            } else {
                this.cancelAutoPlay();
            }

            this.setState(state);
        }

        /**
         * 设置自动轮播
         * @param interval 间隔 ms
         * @param auto
         * @param freeMode
         */

    }, {
        key: 'setAutoPlay',
        value: function setAutoPlay(interval, auto, freeMode) {
            var _this4 = this;

            auto = auto || this.props.auto;
            interval = interval || this.props.interval;
            freeMode = freeMode || false;
            if (!auto || freeMode) return;
            this.cancelAutoPlay();
            this.__timer = setInterval(function () {
                _this4.scrollToIndex(_this4.state.current + 1);
            }, interval);
        }

        /**
         * 取消自动轮播
         */

    }, {
        key: 'cancelAutoPlay',
        value: function cancelAutoPlay() {
            clearInterval(this.__timer);
        }

        /**
         * 对外部传入的images数组做一次处理, 确认分组以及分组后的长度
         */

    }, {
        key: 'refineImages',
        value: function refineImages(images, group) {
            if (images && group > 1) {
                var imagesInGroup = [];
                for (var i = 0, n = images.length; i < n; i += group) {
                    imagesInGroup.push(images.slice(i, i + group));
                }

                return imagesInGroup;
            }
            return images;
        }
    }, {
        key: 'scrollToIndex',
        value: function scrollToIndex(index) {
            if (!this.props.loop) {
                index = this._limit(index);
            }
            this.setState({
                tending: index,
                reset: false
            });
        }
    }, {
        key: 'handleSwiping',
        value: function handleSwiping(e, deltaX) {
            this.setState({
                delta: -deltaX,
                onVelocity: false
            });

            //拖动过程中, 停止自动轮播
            this.cancelAutoPlay();
        }
    }, {
        key: 'handleSwiped',
        value: function handleSwiped() {
            this.setState({
                delta: 0,
                reset: false,
                onVelocity: true
            });

            //拖动结束, 恢复轮播

            this.setAutoPlay();
        }
    }, {
        key: 'handleSwipedLeft',
        value: function handleSwipedLeft(velocity) {
            var _state2 = this.state;
            var current = _state2.current;
            var tending = _state2.tending;
            var length = _state2.length;
            var delta = _state2.delta;
            var offset = _state2.offset;
            var _props2 = this.props;
            var lazy = _props2.lazy;
            var loop = _props2.loop;
            var freeMode = _props2.freeMode;

            //跟随型

            if (freeMode) {
                var strictOffset = offset + delta - velocity * VELOCITY_FORCE;
                this.setState({
                    onVelocity: true,
                    offset: this._getMinOffset(strictOffset),
                    delta: 0
                });
                return;
            }
            if (!loop && current >= length - 1) {
                this.setState({
                    tending: current,
                    current: tending
                });
            } else {
                this.setState({
                    tending: current + 1,
                    current: tending
                });
            }
        }
    }, {
        key: 'handleSwipedRight',
        value: function handleSwipedRight(velocity) {
            var _state3 = this.state;
            var current = _state3.current;
            var tending = _state3.tending;
            var length = _state3.length;
            var delta = _state3.delta;
            var offset = _state3.offset;
            var _props3 = this.props;
            var lazy = _props3.lazy;
            var loop = _props3.loop;
            var freeMode = _props3.freeMode;
            var _Math = Math;
            var min = _Math.min;
            var max = _Math.max;

            if (freeMode) {
                var strictOffset = offset + delta + velocity * VELOCITY_FORCE;

                this.setState({
                    onVelocity: true,
                    offset: this._getMinOffset(strictOffset),
                    delta: 0
                });
                return;
            }
            if (!loop && current <= 0) {
                this.setState({
                    tending: current,
                    current: tending
                });
            } else {
                this.setState({
                    tending: current - 1,
                    current: tending
                });
            }
        }

        /**
         * 跟随模式下,最小translate值
         * @param value
         * @returns {*}
         * @private
         */

    }, {
        key: '_getMinOffset',
        value: function _getMinOffset(value, props, state) {
            props = props || this.props;
            state = state || this.state;
            var _state4 = state;
            var length = _state4.length;
            var _props4 = props;
            var narrow = _props4.narrow;
            var narrowValue = _props4.narrowValue;
            var _Math2 = Math;
            var max = _Math2.max;
            var min = _Math2.min;

            if (this.content) {
                var width = this.content.clientWidth,
                    offset = -width * (length - 1);

                if (narrow) {
                    offset += width * (narrowValue / (100 - narrowValue / 100));
                }

                return min(0, max(value, offset));
            }
            return 0;
        }
    }, {
        key: '_limit',
        value: function _limit(index, length) {
            var len = length || this.state.length;
            return (index % len + len) % len;
        }
    }, {
        key: '_translate',
        value: function _translate(i) {
            //return {
            //    WebkitTransform: `translate3d(${i * 100}%, 0, 0)`,
            //    transform: `translate3d(${i * 100}%, 0, 0)`
            //}
            var style = {
                left: i * 100 + '%'
            };
            //const { narrow } = this.props;
            //if(narrow) {
            //    style.width = '80%'
            //}
            return style;
        }
    }, {
        key: '_getImageFrame',
        value: function _getImageFrame(src, i, group) {
            var _this5 = this;

            if (src && src instanceof Array && src.length > 0) {
                var _ret = function () {
                    var style = {
                        width: 100 / Math.max(group, src.length) + '%'
                    };

                    var groups = src.map(function (img, index) {
                        return _react2.default.createElement(
                            'div',
                            { key: index, className: 'image-group', style: style },
                            _react2.default.createElement(
                                'div',
                                { className: 'image-box' },
                                _react2.default.createElement('img', { className: PRE_CLS + '-img', src: img })
                            )
                        );
                    });

                    return {
                        v: _react2.default.createElement(
                            'div',
                            { key: i, className: 'frame frame-group', style: _this5._translate(i) },
                            groups
                        )
                    };
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            } else {
                return _react2.default.createElement(
                    'div',
                    { key: i, className: 'frame', style: this._translate(i) },
                    _react2.default.createElement(
                        'div',
                        { className: 'image-box' },
                        _react2.default.createElement('img', { className: PRE_CLS + '-img', src: src })
                    )
                );
            }
        }

        /**
         * 自由组合类型
         * @private
         */

    }, {
        key: '_getCustomFrame',
        value: function _getCustomFrame(childIndex, i) {
            var children = this.props.children;
            var child = children[childIndex];

            var others = _objectWithoutProperties(child.props, []);

            return _react2.default.createElement(
                Frame,
                _extends({ key: i, style: this._translate(i) }, others),
                child.props.children
            );
        }
    }, {
        key: '_getFrames',
        value: function _getFrames(index) {
            var withChildren = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var _props5 = this.props;
            var loop = _props5.loop;
            var lazy = _props5.lazy;
            var group = _props5.group;
            var freeMode = _props5.freeMode;
            var _state5 = this.state;
            var preLoad = _state5.preLoad;
            var frames = _state5.frames;
            var length = _state5.length;
            var _Math3 = Math;
            var min = _Math3.min;
            var max = _Math3.max;


            var scope = 3,
                half = parseInt(scope / 2),
                result = [],
                scopeLeft = 0,
                scopeRight = length - 1;

            //lazy load
            if (lazy) {
                if (!loop) {
                    scopeLeft = max(0, scopeLeft);
                    scopeRight = min(length - 1, scopeRight);
                } else {
                    scopeLeft = index - half;
                    scopeRight = index + half;
                }
            } else {
                //not lazy but with loop
                if (loop) {
                    scopeLeft = index - preLoad;
                    scopeRight = index + preLoad;
                    //if (scopeLeft < 0) {
                    //    scopeRight = scopeLeft + length;
                    //} else if (scopeRight >= length) {
                    //    scopeLeft = scopeRight - length;
                    //}
                }
            }

            if (freeMode) {
                scopeLeft = 0;
                scopeRight = length - 1;
            }
            for (var i = scopeLeft; i <= scopeRight; i++) {
                var frame = null;
                if (withChildren) {
                    frame = this._getCustomFrame(this._limit(i), i, group);
                } else {
                    frame = this._getImageFrame(frames[this._limit(i)], i, group);
                }
                result.push(frame);
            }
            return result;
        }

        /**
         * 计算初始偏移量
         */

    }, {
        key: '_getBase',
        value: function _getBase(current) {
            var _props6 = this.props;
            var narrow = _props6.narrow;
            var narrowValue = _props6.narrowValue;
            var loop = _props6.loop;
            var freeMode = _props6.freeMode;
            var _state6 = this.state;
            var length = _state6.length;
            var offset = _state6.offset;


            if (freeMode) {
                return offset;
            }
            var base = current * -100,
                paddingValue = narrowValue / (1 - narrowValue / 100);
            if (narrow && !loop) {
                if (current > 0 && current < length - 1) {
                    base += paddingValue / 2;
                } else if (current === length - 1) {
                    base += paddingValue;
                }
            } else if (narrow && loop) {
                base += paddingValue / 2;
            }
            return base + '%';
        }
    }, {
        key: '_hasValidChildren',
        value: function _hasValidChildren() {
            var children = this.props.children;

            var valid = true;
            if (children && children.length > 0) {
                children.map(function (child, index) {
                    if (!child || child.props.sClass !== FRAME_CLS) {
                        valid = false;
                    }
                });
                return valid;
            }
            return false;
        }

        /**
         * todo 单张轮播图的情况
         * @returns {XML}
         */

    }, {
        key: 'render',
        value: function render() {
            var _classNames;

            var _state7 = this.state;
            var delta = _state7.delta;
            var current = _state7.current;
            var tending = _state7.tending;
            var length = _state7.length;
            var reset = _state7.reset;
            var onVelocity = _state7.onVelocity;
            var _props7 = this.props;
            var loop = _props7.loop;
            var lazy = _props7.lazy;
            var freeMode = _props7.freeMode;
            var group = _props7.group;
            var indicator = _props7.indicator;
            var indicatorSeparate = _props7.indicatorSeparate;
            var width = _props7.width;
            var height = _props7.height;
            var narrow = _props7.narrow;
            var narrowValue = _props7.narrowValue;

            var others = _objectWithoutProperties(_props7, ['loop', 'lazy', 'freeMode', 'group', 'indicator', 'indicatorSeparate', 'width', 'height', 'narrow', 'narrowValue']);

            var _Math4 = Math;
            var abs = _Math4.abs;
            var min = _Math4.min;
            var max = _Math4.max;

            var base = this._getBase(current),
                tendingOffset = this._getBase(tending),
                style = null,
                containerWidth = 100;

            if (narrow) {
                containerWidth -= narrowValue;
            }

            //非循环类型, 到达边界, 模拟阻力
            var resistance = 1;
            if (!loop && (current <= 0 || current >= length - 1)) {
                resistance = 1 - min(abs(delta), RESISTANCE_COEFFICIENT) / RESISTANCE_COEFFICIENT;
            }

            //滑动动画进行中  todo 美化style的构造方法
            if (current !== tending) {
                style = {
                    WebkitTransform: 'translate3d(' + tendingOffset + ', 0, 0)',
                    transform: 'translate3d(' + tendingOffset + ', 0, 0)',
                    WebkitTransition: '-webkit-transform 0.3s ease-out',
                    transition: 'transform 0.3s ease-out'

                };
            } else {
                if (freeMode) {
                    var offset = base + delta;
                    var trans = '0.6s cubic-bezier(0, 0.6, 0.4, 1)';

                    //if(offset > 0 || offset < minOffset) {
                    //    resistance = 1 - min(abs(offset), RESISTANCE_COEFFICIENT) / RESISTANCE_COEFFICIENT;
                    //    trans = '0.3s cubic-bezier(0.5, 0, 1, 0.5)';
                    //}
                    style = {
                        WebkitTransform: 'translate3d(' + offset + 'px, 0, 0)',
                        transform: 'translate3d(' + offset + 'px, 0, 0)',
                        WebkitTransition: delta === 0 ? '-webkit-transform ' + trans : 'none',
                        transition: delta === 0 ? 'transform ' + trans : 'none'
                    };
                } else if (delta === 0 && !reset) {
                    style = {
                        WebkitTransform: 'translate3d(' + base + ', 0, 0)',
                        transform: 'translate3d(' + base + ', 0, 0)',
                        WebkitTransition: '-webkit-transform 0.3s ease-out',
                        transition: 'transform 0.3s ease-out'
                    };
                } else {
                    style = {
                        WebkitTransform: 'translate3d(' + base + ', 0, 0) translate3d(' + delta * resistance + 'px, 0, 0)',
                        transform: 'translate3d(' + base + ', 0, 0) translate3d(' + delta * resistance + 'px, 0, 0)',
                        WebkitTransition: onVelocity ? '-webkit-transform 0.3s ease-out' : 'none',
                        transition: onVelocity ? 'transform 0.3s ease-out' : 'none'
                    };
                }
            }

            style.width = containerWidth + '%';

            //todo 组合内容 & 露头
            var withChildren = this._hasValidChildren();

            return _react2.default.createElement(
                'div',
                _extends({ className: (0, _classnames2.default)(PRE_CLS, (_classNames = {}, _defineProperty(_classNames, PRE_CLS + '-custom', withChildren), _defineProperty(_classNames, PRE_CLS + '-narrow', narrow), _defineProperty(_classNames, PRE_CLS + '-loop', loop), _defineProperty(_classNames, PRE_CLS + '-group', group > 1), _defineProperty(_classNames, PRE_CLS + '-free', freeMode), _classNames)) }, others),
                _react2.default.createElement(
                    Swipable,
                    {
                        className: 'swipe-area',
                        style: {
                            width: width,
                            height: height
                        },
                        onSwipedLeft: this.handleSwipedLeft.bind(this),
                        onSwipedRight: this.handleSwipedRight.bind(this),
                        onSwiped: this.handleSwiped.bind(this),
                        onSwipingLeft: this.handleSwiping.bind(this),
                        onSwipingRight: this.handleSwiping.bind(this) },
                    _react2.default.createElement(
                        'div',
                        {
                            className: (0, _classnames2.default)(PRE_CLS + '-container'),
                            ref: 'content',
                            style: style },
                        this._getFrames(current, withChildren)
                    )
                ),
                !freeMode && indicator && _react2.default.createElement(Indicator, { total: length,
                    current: this._limit(current),
                    separate: indicatorSeparate })
            );
        }
    }]);

    return Slider;
}(_react.Component);

exports.default = Slider;


Slider.defaultProps = {
    loop: false,
    lazy: false,
    auto: false,
    freeMode: false,
    interval: 3000,
    indicator: true,
    indicatorSeparate: false,
    group: 1,
    narrow: false,
    narrowValue: 20,
    current: null
};

Slider.propTypes = {
    loop: _react.PropTypes.bool,
    lazy: _react.PropTypes.bool,
    auto: _react.PropTypes.bool,
    freeMode: _react.PropTypes.bool,
    interval: _react.PropTypes.number,
    indicator: _react.PropTypes.bool,
    indicatorSeparate: _react.PropTypes.bool,
    group: _react.PropTypes.number,
    narrow: _react.PropTypes.bool,
    narrowValue: _react.PropTypes.number,
    images: _react.PropTypes.array
};

var Frame = exports.Frame = function (_Component3) {
    _inherits(Frame, _Component3);

    function Frame() {
        _classCallCheck(this, Frame);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Frame).apply(this, arguments));
    }

    _createClass(Frame, [{
        key: 'render',
        value: function render() {
            var _props8 = this.props;
            var children = _props8.children;

            var others = _objectWithoutProperties(_props8, ['children']);

            return _react2.default.createElement(
                'div',
                _extends({ className: 'custom-frame' }, others),
                children
            );
        }
    }]);

    return Frame;
}(_react.Component);

Frame.defaultProps = {
    sClass: FRAME_CLS
};

Slider.Frame = Frame;

var Indicator = function (_Component4) {
    _inherits(Indicator, _Component4);

    function Indicator() {
        _classCallCheck(this, Indicator);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Indicator).apply(this, arguments));
    }

    _createClass(Indicator, [{
        key: 'render',
        value: function render() {
            var _props9 = this.props;
            var total = _props9.total;
            var current = _props9.current;
            var separate = _props9.separate;


            return _react2.default.createElement(
                'ul',
                { className: (0, _classnames2.default)("indicator", {
                        'indicator-separate': separate }) },
                [].concat(_toConsumableArray(Array(total))).map(function (item, index) {
                    return _react2.default.createElement('li', { key: index, className: (0, _classnames2.default)('dot', { current: current === index }) });
                })
            );
        }
    }]);

    return Indicator;
}(_react.Component);

Indicator.propTypes = {
    total:   _PropTypes2.default.number,
    current: _PropTypes2.default.number
};

Indicator.defaultProps = {
    current: 0
};
