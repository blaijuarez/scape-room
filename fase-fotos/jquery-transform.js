/*
 * jQuery 2d Transform
 * http://wiki.github.com/heygrady/transform/
 *
 * Copyright 2010, Grady Kuhnline
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function (f, g, i, b) {
  var c = 180 / Math.PI;
  var j = 200 / Math.PI;
  var e = Math.PI / 180;
  var d = 2 / 1.8;
  var h = 0.9;
  var a = Math.PI / 200;
  f.extend({
    angle: {
      runit: /(deg|g?rad)/,
      radianToDegree: function (k) {
        return k * c;
      },
      radianToGrad: function (k) {
        return k * j;
      },
      degreeToRadian: function (k) {
        return k * e;
      },
      degreeToGrad: function (k) {
        return k * d;
      },
      gradToDegree: function (k) {
        return k * h;
      },
      gradToRadian: function (k) {
        return k * a;
      },
    },
  });
})(jQuery, this, this.document);
(function (f, e, b, g) {
  var c = /progid:DXImageTransform\.Microsoft\.Matrix\(.*?\)/;
  f.extend({
    transform: function (h) {
      this.$elem = f(h);
      this.transformProperty = this.getTransformProperty();
    },
  });
  f.extend(f.transform, {
    funcs: [
      "origin",
      "reflect",
      "reflectX",
      "reflectXY",
      "reflectY",
      "rotate",
      "scale",
      "scaleX",
      "scaleY",
      "skew",
      "skewX",
      "skewY",
      "translate",
      "translateX",
      "translateY",
    ],
    rfunc: {
      angle: /^rotate|skew[X|Y]?$/,
      length: /^origin|translate[X|Y]?$/,
      scale: /^scale[X|Y]?$/,
      reflect: /^reflect(XY|X|Y)?$/,
    },
  });
  f.fn.transform = function (h, i) {
    return this.each(function () {
      var j = new f.transform(this);
      if (h) {
        j.transform(h, i);
      }
    });
  };
  f.transform.prototype = {
    transform: function (h, i) {
      var j = this.transformProperty;
      i = f.extend(
        true,
        {
          forceMatrix: false,
          preserve: false,
        },
        i
      );
      if (i.preserve) {
        h = f.extend(true, this.getAttrs(true, true), h);
      } else {
        h = f.extend(true, {}, h);
      }
      this.clearAttrs();
      this.setAttrs(h);
      if (j && !i.forceMatrix) {
        return this.applyFuncs(h);
      } else {
        if (f.browser.msie || (j && i.forceMatrix)) {
          return this.applyMatrix(h);
        }
      }
      return false;
    },
    applyFuncs: function (j, h) {
      var i = [];
      var l = this.transformProperty;
      for (var k in j) {
        if (k == "origin") {
          this[k].apply(this, f.isArray(j[k]) ? j[k] : [j[k]]);
        } else {
          if (f.inArray(f.transform.funcs, k)) {
            i.push(this.createTransformFunc(k, j[k]));
          }
        }
      }
      this.$elem.css(l, i.join(" "));
      this.$elem.data("transformed", true);
      return true;
    },
    applyMatrix: function (i) {
      var t,
        v = this.transformProperty,
        q;
      var k = function (x, w) {
        q[x] = parseFloat(w);
      };
      for (var l in i) {
        if (f.matrix[l]) {
          q = f.isArray(i[l]) ? i[l] : [i[l]];
          f.each(q, k);
          if (!t) {
            t = f.matrix[l].apply(this, q);
          } else {
            t = t.x(f.matrix[l].apply(this, q));
          }
        } else {
          if (l == "origin") {
            q = f.isArray(i[l]) ? i[l] : [i[l]];
            this[l].apply(this, q);
          }
        }
      }
      if (!t) {
        return;
      }
      var u = parseFloat(parseFloat(t.e(1, 1)).toFixed(8)),
        s = parseFloat(parseFloat(t.e(2, 1)).toFixed(8)),
        r = parseFloat(parseFloat(t.e(1, 2)).toFixed(8)),
        p = parseFloat(parseFloat(t.e(2, 2)).toFixed(8)),
        n = parseFloat(parseFloat(t.e(1, 3)).toFixed(8)),
        m = parseFloat(parseFloat(t.e(2, 3)).toFixed(8));
      if (v && v.substr(0, 4) == "-moz") {
        this.$elem.css(
          v,
          "matrix(" +
            u +
            ", " +
            s +
            ", " +
            r +
            ", " +
            p +
            ", " +
            n +
            "px, " +
            m +
            "px)"
        );
      } else {
        if (v) {
          this.$elem.css(
            v,
            "matrix(" +
              u +
              ", " +
              s +
              ", " +
              r +
              ", " +
              p +
              ", " +
              n +
              ", " +
              m +
              ")"
          );
        } else {
          if (jQuery.browser.msie) {
            var h = this.$elem[0].style;
            var o =
              "progid:DXImageTransform.Microsoft.Matrix(M11=" +
              u +
              ", M12=" +
              r +
              ", M21=" +
              s +
              ", M22=" +
              p +
              ", sizingMethod='auto expand')";
            var j = h.filter || jQuery.curCSS(this.$elem[0], "filter") || "";
            h.filter = c.test(j) ? j.replace(c, o) : j ? j + " " + o : o;
            this.$elem.css({
              zoom: 1,
            });
            this.fixPosition(t, n, m);
          }
        }
      }
      this.$elem.data("transformed", true);
      return true;
    },
    origin: function (i, l) {
      var k = this.transformProperty,
        h = this.safeOuterHeight(),
        j = this.safeOuterWidth();
      switch (i) {
        case "left":
          i = "0";
          break;
        case "right":
          i = j;
          break;
        case "center":
          i = j * 0.5;
          break;
      }
      switch (l) {
        case "top":
          l = "0";
          break;
        case "bottom":
          l = h;
          break;
        case "center":
        case g:
          l = h * 0.5;
          break;
      }
      i = /%/.test(i) ? (j * parseFloat(i)) / 100 : parseFloat(i);
      if (typeof l !== "undefined") {
        l = /%/.test(l) ? (h * parseFloat(l)) / 100 : parseFloat(l);
      }
      if (k) {
        if (!l && l !== 0) {
          this.$elem.css(k + "-origin", i + "px");
        } else {
          this.$elem.css(k + "-origin", i + "px " + l + "px");
        }
      }
      if (!l && l !== 0) {
        this.setAttr("origin", i);
      } else {
        this.setAttr("origin", [i, l]);
      }
      return true;
    },
    getTransformProperty: function () {
      if (this.transformProperty) {
        return this.transformProperty;
      }
      var i = this.$elem[0];
      var h;
      var j = {
        transform: "transform",
        MozTransform: "-moz-transform",
        WebkitTransform: "-webkit-transform",
        OTransform: "-o-transform",
      };
      for (var k in j) {
        if (typeof i.style[k] !== "undefined") {
          h = j[k];
          return h;
        }
      }
      return null;
    },
    createTransformFunc: function (k, l) {
      if (f.transform.rfunc.reflect.test(k) && l) {
        var j = f.matrix[k](),
          i = j.e(1, 1),
          h = j.e(2, 1),
          n = j.e(1, 2),
          m = j.e(2, 2);
        return "matrix(" + i + ", " + h + ", " + n + ", " + m + ", 0, 0)";
      }
      l = d(k, l);
      if (!f.isArray(l)) {
        return k + "(" + l + ")";
      } else {
        return k + "(" + l[0] + ", " + l[1] + ")";
      }
    },
    fixPosition: function (q, n, m) {
      var s = this.safeOuterHeight(),
        h = this.safeOuterWidth(),
        l = new f.matrix.calc(q, s, h),
        r = this.getAttr("origin", true);
      var k = l.originOffset({
        x: parseFloat(r[0]),
        y: parseFloat(r[1]),
      });
      var i = l.sides();
      var j = this.$elem.css("position");
      if (j == "static") {
        j = "relative";
      }
      var p = {
        top: 0,
        left: 0,
      };
      var o = {
        position: j,
        top: k.top + m + i.top + p.top + "px",
        left: k.left + n + i.left + p.left + "px",
      };
      this.$elem.css(o);
    },
    safeOuterHeight: function () {
      return this.safeOuterLength("Height");
    },
    safeOuterWidth: function () {
      return this.safeOuterLength("Width");
    },
    safeOuterLength: function (l) {
      var k = "outer" + (l.toLowerCase() == "width" ? "Width" : "Height");
      if (f.browser.msie) {
        var j = this.$elem[0];
        var h = j.style.filter;
        j.style.filter = "";
        var i = this.$elem[k]();
        j.style.filter = h;
        return i;
      }
      return this.$elem[k]();
    },
    clearAttrs: function () {
      f.each(
        f.transform.funcs,
        f.proxy(function (h, j) {
          if (this.$elem[0][j] !== g) {
            this.$elem[0][j] = g;
          }
        }, this)
      );
    },
    setAttrs: function (h) {
      f.each(h, f.proxy(this.setAttr, this));
    },
    setAttr: function (h, i) {
      if (f.isArray(i)) {
        f.each(i, function (j) {
          i[j] = parseFloat(i[j]);
        });
        i = i.join(" ");
      } else {
        if (i || i === 0) {
          i = parseFloat(i);
        }
      }
      this.$elem[0][h] = i;
    },
    getAttrs: function (j, i) {
      var h = {},
        k;
      f.each(
        f.transform.funcs,
        f.proxy(function (l, m) {
          k = this.getAttr(m, j, i, true);
          if (k || k === 0) {
            h[m] = k;
          }
        }, this)
      );
      return h;
    },
    getAttr: function (m, j, i, h) {
      var n = this.$elem[0][m];
      var k = /\s/;
      var l = /%/;
      if (h && !n && n !== 0) {
        return n;
      } else {
        if (!n && n !== 0) {
          if (m == "origin") {
            n = this.transformProperty
              ? this.$elem.css(this.transformProperty + "-origin")
              : this.safeOuterWidth() * 0.5 +
                " " +
                this.safeOuterHeight() * 0.5;
            if (l.test(n)) {
              n = n.split(k);
              if (l.test(n[0])) {
                n[0] = this.safeOuterWidth() * (parseFloat(n[0]) / 100);
              }
              if (l.test(n[1])) {
                n[1] = this.safeOuterHeight() * (parseFloat(n[1]) / 100);
              }
              n = n.join(" ");
            }
            n = n.replace(/px/g, "");
          } else {
            n = f.transform.rfunc.scale.test(m) ? 1 : 0;
          }
        }
      }
      if (i) {
        if (k.test(n)) {
          n = n.split(k);
        }
        n = d(m, n);
        if (f.isArray() && !j) {
          n = n.join(" ");
        }
      } else {
        if (j && k.test(n)) {
          n = n.split(k);
        }
      }
      return n;
    },
  };
  var a = /^([+\-]=)?([\d+.\-]+)(.*)$/;
  function d(j, o) {
    var q = !f.isArray(o) ? [o] : [o[0], o[1]],
      h = f.transform.rfunc.angle,
      p = f.transform.rfunc.length;
    for (var l = 0, m = q.length; l < m; l++) {
      var k = a.exec(q[l]),
        n = "";
      if (h.test(j)) {
        n = "deg";
        if (k[3] && !f.angle.runit.test(k[3])) {
          k[3] = null;
        }
      } else {
        if (p.test(j)) {
          n = "px";
        }
      }
      if (!k) {
        q[l] = 0 + n;
      } else {
        if (!k[3]) {
          q[l] += n;
        }
      }
    }
    return m == 1 ? q[0] : q;
  }
})(jQuery, this, this.document);
(function (c, b, a, d) {
  c.extend({
    matrix: {},
  });
  c.extend(c.matrix, {
    calc: function (e, f, g) {
      this.matrix = e;
      this.outerHeight = f;
      this.outerWidth = g;
    },
    reflect: function () {
      return $M([
        [-1, 0, 0],
        [0, -1, 0],
        [0, 0, 1],
      ]);
    },
    reflectX: function () {
      return $M([
        [1, 0, 0],
        [0, -1, 0],
        [0, 0, 1],
      ]);
    },
    reflectXY: function () {
      return $M([
        [0, 1, 0],
        [1, 0, 0],
        [0, 0, 1],
      ]);
    },
    reflectY: function () {
      return $M([
        [-1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]);
    },
    rotate: function (i) {
      var f = c.angle.degreeToRadian(i),
        h = Math.cos(f),
        j = Math.sin(f);
      var g = h,
        e = j,
        l = -j,
        k = h;
      return $M([
        [g, l, 0],
        [e, k, 0],
        [0, 0, 1],
      ]);
    },
    scale: function (f, e) {
      f = f || f === 0 ? f : 1;
      e = e || e === 0 ? e : 1;
      return $M([
        [f, 0, 0],
        [0, e, 0],
        [0, 0, 1],
      ]);
    },
    scaleX: function (e) {
      return c.matrix.scale(e);
    },
    scaleY: function (e) {
      return c.matrix.scale(1, e);
    },
    skew: function (h, f) {
      var i = c.angle.degreeToRadian(h),
        g = c.angle.degreeToRadian(f),
        e = Math.tan(i),
        j = Math.tan(g);
      return $M([
        [1, e, 0],
        [j, 1, 0],
        [0, 0, 1],
      ]);
    },
    skewX: function (g) {
      var f = c.angle.degreeToRadian(g),
        e = Math.tan(f);
      return $M([
        [1, e, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]);
    },
    skewY: function (f) {
      var e = c.angle.degreeToRadian(f),
        g = Math.tan(e);
      return $M([
        [1, 0, 0],
        [g, 1, 0],
        [0, 0, 1],
      ]);
    },
    translate: function (f, e) {
      f = f ? f : 0;
      e = e ? e : 0;
      return $M([
        [1, 0, f],
        [0, 1, e],
        [0, 0, 1],
      ]);
    },
    translateX: function (e) {
      return c.matrix.translate(e);
    },
    translateY: function (e) {
      return c.matrix.translate(0, e);
    },
  });
  c.matrix.calc.prototype = {
    coord: function (e, h) {
      var f = this.matrix,
        g = f.x($M([[e], [h], [1]]));
      return {
        x: parseFloat(parseFloat(g.e(1, 1)).toFixed(8)),
        y: parseFloat(parseFloat(g.e(2, 1)).toFixed(8)),
      };
    },
    corners: function () {
      var f = this.outerHeight,
        e = this.outerWidth;
      return {
        tl: this.coord(0, 0),
        bl: this.coord(0, f),
        tr: this.coord(e, 0),
        br: this.coord(e, f),
      };
    },
    sides: function () {
      var f = this.corners();
      var g = {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
        e,
        i;
      for (var h in f) {
        e = f[h].x;
        i = f[h].y;
        if (i < g.top) {
          g.top = i;
        }
        if (i > g.bottom) {
          g.bottom = i;
        }
        if (e < g.left) {
          g.left = e;
        }
        if (e > g.right) {
          g.right = e;
        }
      }
      return g;
    },
    size: function () {
      var e = this.sides();
      return {
        height: Math.abs(e.bottom - e.top),
        width: Math.abs(e.right - e.left),
      };
    },
    originOffset: function (h, g) {
      h = h
        ? h
        : {
            x: this.outerWidth * 0.5,
            y: this.outerHeight * 0.5,
          };
      g = g
        ? g
        : {
            x: 0,
            y: 0,
          };
      var e = this.coord(h.x, h.y);
      var f = this.coord(g.x, g.y);
      return {
        top: f.y - g.y - (e.y - h.y),
        left: f.x - g.x - (e.x - h.x),
      };
    },
  };
})(jQuery, this, this.document);
(function (e, d, b, f) {
  var a = /^([+\-]=)?([\d+.\-]+)(.*)$/;
  var c = /^(.*?)\s+([+\-]=)?([\d+.\-]+)(.*)$/;
  var h = e.fn.animate;
  e.fn.animate = function (m, j, l, k) {
    if (m && !jQuery.isEmptyObject(m)) {
      var i = this;
      jQuery.each(m, function (n, o) {
        for (var s = 0, t = e.transform.funcs.length; s < t; s++) {
          if (n == e.transform.funcs[s]) {
            var r = a.exec(o);
            if (r) {
              var p = parseFloat(r[2]),
                u = r[3] || "px",
                v = [];
              v.push({
                end: (r[1] ? r[1] : "") + p,
                unit: u,
              });
              var q = 0;
              while ((r = c.exec(u))) {
                v[q].unit = r[1];
                v.push({
                  end: (r[2] ? r[2] : "") + parseFloat(r[3]),
                  unit: r[4],
                });
                u = r[4];
                q++;
              }
              i.each(function () {
                this["data-animate-" + n] = v;
              });
              m[n] = v[0].end;
            }
          }
        }
      });
    }
    return h.apply(this, arguments);
  };
  var g = e.fx.prototype.cur;
  e.fx.prototype.cur = function (l) {
    for (var k = 0, j = e.transform.funcs.length; k < j; k++) {
      if (this.prop == e.transform.funcs[k]) {
        this.transform = this.transform || new e.transform(this.elem);
        var m = a.exec(this.transform.getAttr(this.prop));
        return parseFloat(m[2]) || 0;
      }
    }
    return g.apply(this, arguments);
  };
  e.fx.multivalueInit = function (k) {
    var l,
      i = k.transform.getAttr(k.prop, true),
      j = k.elem["data-animate-" + k.prop];
    k.values = [];
    if (j) {
      var m;
      e.each(j, function (n, o) {
        m = i[n];
        if (!m && m !== 0) {
          m = e.transform.rfunc.scale.test(k.prop) ? 1 : 0;
        }
        m = parseFloat(m);
        if ((l = a.exec(o.end))) {
          if (l[1]) {
            o.end = (l[1] === "-=" ? -1 : 1) * parseFloat(l[2]) + m;
          }
        }
        k.values.push({
          start: m,
          end: o.end,
          unit: o.unit,
        });
      });
    } else {
      k.values.push({
        start: k.start,
        end: k.end,
        unit: k.unit,
      });
    }
  };
  e.fx.multivalueStep = {
    _default: function (i) {
      e.each(i.values, function (j, k) {
        i.values[j].now = k.start + (k.end - k.start) * i.pos;
      });
    },
  };
  e.each(e.transform.funcs, function (j, k) {
    e.fx.step[k] = function (n) {
      if (!n.transformInit) {
        n.transform = n.transform || new e.transform(n.elem);
        if (isNaN(n.start)) {
          n.start = n.transform.getAttr(n.prop, true);
          if (e.isArray(n.start)) {
            n.start = n.start[0];
          }
          n.now = n.start + (n.end - n.start) * n.pos;
        }
        e.fx.multivalueInit(n);
        if (n.values.length > 1) {
          n.multiple = true;
        }
        var m = e.transform.rfunc;
        if (m.angle.test(n.prop)) {
          n.unit = "deg";
        } else {
          if (m.scale.test(n.prop)) {
            n.unit = "";
          } else {
            if (m.reflect.test(n.prop)) {
              n.unit = "";
            }
          }
        }
        e.each(n.values, function (o) {
          n.values[o].unit = n.unit;
        });
        n.transformInit = true;
        if (n.start == n.end) {
          return n.step(true);
        }
      }
      if (n.multiple) {
        (e.fx.multivalueStep[n.prop] || e.fx.multivalueStep._default)(n);
      } else {
        n.values[0].now = n.now;
      }
      var l = [];
      e.each(n.values, function (o, p) {
        if (p.unit == "deg") {
          while (p.now >= 360) {
            p.now -= 360;
          }
          while (p.now <= -360) {
            p.now += 360;
          }
        }
        l.push(parseFloat(parseFloat(p.now).toFixed(8)) + p.unit);
      });
      var i = {};
      i[n.prop] = n.multiple ? l : l[0];
      n.transform.transform(i, {
        preserve: true,
      });
    };
  });
})(jQuery, this, this.document);

// === Sylvester ===
// Vector and Matrix mathematics modules for JavaScript
// Copyright (c) 2007 James Coglan
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var Sylvester = {
  version: "0.1.3",
  precision: 0.000001,
};
function Matrix() {}
Matrix.prototype = {
  e: function (b, a) {
    if (
      b < 1 ||
      b > this.elements.length ||
      a < 1 ||
      a > this.elements[0].length
    ) {
      return null;
    }
    return this.elements[b - 1][a - 1];
  },
  map: function (f) {
    var e = [],
      d = this.elements.length,
      h = d,
      c,
      b,
      g = this.elements[0].length,
      a;
    do {
      c = h - d;
      b = g;
      e[c] = [];
      do {
        a = g - b;
        e[c][a] = f(this.elements[c][a], c + 1, a + 1);
      } while (--b);
    } while (--d);
    return Matrix.create(e);
  },
  canMultiplyFromLeft: function (a) {
    var b = a.elements || a;
    if (typeof b[0][0] === "undefined") {
      b = Matrix.create(b).elements;
    }
    return this.elements[0].length == b.length;
  },
  multiply: function (q) {
    if (!q.elements) {
      return this.map(function (c) {
        return c * q;
      });
    }
    var h = q.modulus ? true : false;
    var n = q.elements || q;
    if (typeof n[0][0] === "undefined") {
      n = Matrix.create(n).elements;
    }
    if (!this.canMultiplyFromLeft(n)) {
      return null;
    }
    var e = this.elements.length,
      f = e,
      l,
      b,
      d = n[0].length,
      g;
    var p = this.elements[0].length,
      a = [],
      m,
      k,
      o;
    do {
      l = f - e;
      a[l] = [];
      b = d;
      do {
        g = d - b;
        m = 0;
        k = p;
        do {
          o = p - k;
          m += this.elements[l][o] * n[o][g];
        } while (--k);
        a[l][g] = m;
      } while (--b);
    } while (--e);
    var n = Matrix.create(a);
    return h ? n.col(1) : n;
  },
  x: function (a) {
    return this.multiply(a);
  },
  setElements: function (h) {
    var m,
      a = h.elements || h;
    if (typeof a[0][0] !== "undefined") {
      var d = a.length,
        f = d,
        b,
        c,
        l;
      this.elements = [];
      do {
        m = f - d;
        b = a[m].length;
        c = b;
        this.elements[m] = [];
        do {
          l = c - b;
          this.elements[m][l] = a[m][l];
        } while (--b);
      } while (--d);
      return this;
    }
    var e = a.length,
      g = e;
    this.elements = [];
    do {
      m = g - e;
      this.elements.push([a[m]]);
    } while (--e);
    return this;
  },
};
Matrix.create = function (a) {
  var b = new Matrix();
  return b.setElements(a);
};
var $M = Matrix.create;
