/*
    This file is part of MiraMon Map Browser.
    MiraMon Map Browser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    MiraMon Map Browser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    See the GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General
    Public License along with MiraMon Map Browser.
    If not, see https://www.gnu.org/licenses/licenses.html#AGPL.

    MiraMon Map Browser can be updated from
    https://github.com/grumets/MiraMonMapBrowser.

    Copyright 2001, 2023 Xavier Pons

    Aquest codi JavaScript ha estat idea de Joan Masó Pau (joan maso at uab cat)
    amb l'ajut de Núria Julià (n julia at creaf uab cat)
    dins del grup del MiraMon. MiraMon és un projecte del
    CREAF que elabora programari de Sistema d'Informació Geogràfica
    i de Teledetecció per a la visualització, consulta, edició i anàlisi
    de mapes ràsters i vectorials. Aquest programari inclou
    aplicacions d'escriptori i també servidors i clients per Internet.
    No tots aquests productes són gratuïts o de codi obert.

    En particular, el Navegador de Mapes del MiraMon (client per Internet)
    es distribueix sota els termes de la llicència GNU Affero General Public
    License, mireu https://www.gnu.org/licenses/licenses.html#AGPL.

    El Navegador de Mapes del MiraMon es pot actualitzar des de
    https://github.com/grumets/MiraMonMapBrowser.
*/

//Inspired in: https://codepen.io/jordizle/pen/bGReWV

"use strict"

var eventsCube = new Events();
eventsCube.add = function(obj) {
  obj.eventsCube = { };
}
eventsCube.implement = function(fn) {
  fn.prototype = Object.create(Events.prototype);
}

function Events() {
  this.eventsCube = { };
}

Events.prototype.on = function(name, fn) {
  var eventsCube = this.eventsCube[name];
  if (eventsCube == undefined) {
    this.eventsCube[name] = [ fn ];
    this.emit('event:on', fn);
  } else {
    if (eventsCube.indexOf(fn) == -1) {
      eventsCube.push(fn);
      this.emit('event:on', fn);
    }
  }
  return this;
}

Events.prototype.once = function(name, fn) {
  var eventsCube = this.eventsCube[name];
  fn.once = true;
  if (!eventsCube) {
    this.eventsCube[name] = [ fn ];
    this.emit('event:once', fn);
  } else {
    if (eventsCube.indexOf(fn) == -1) {
      eventsCube.push(fn);
      this.emit('event:once', fn);
    }
  }
  return this;
}

Events.prototype.emit = function(name, args) {
  var eventsCube = this.eventsCube[name];
  if (eventsCube) {
    var i = eventsCube.length;
    while(i--) {
      if (eventsCube[i]) {
        eventsCube[i].call(this, args);
        if (eventsCube[i].once) {
          delete eventsCube[i];
        }
      }
    }
  }
  return this;
}

Events.prototype.unbind = function(name, fn) {
  if (name) {
    var eventsCube = this.eventsCube[name];
    if (eventsCube) {
      if (fn) {
        var i = eventsCube.indexOf(fn);
        if (i != -1) {
          delete eventsCube[i];
        }
      } else {
        delete this.eventsCube[name];
      }
    }
  } else {
    delete this.eventsCube;
    this.eventsCube = { };
  }
  return this;
}

var userPrefixCube;

var prefix = (function () {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('') 
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  userPrefixCube = {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
})();

function bindEvent(element, type, handler) {
  if(element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else {
    element.attachEvent('on' + type, handler);
  }
}

var ViewPortIntervalId=null;

function StopViewport() {
	if (ViewPortIntervalId)
	{
		clearInterval(ViewPortIntervalId);
		ViewPortIntervalId=null;
	}
}


function Viewport(data) {
  eventsCube.add(this);

  var self = this;

  this.element = data.element;
  this.fps = data.fps;
  this.sensivity = data.sensivity;
  this.sensivityFade = data.sensivityFade;
  this.touchSensivity = data.touchSensivity;
  this.speed = data.speed;

  this.lastX = 0;
  this.lastY = 0;
  this.mouseX = 0;
  this.mouseY = 0;
  this.distanceX = 0;
  this.distanceY = 0;
  this.positionX = 1122;
  this.positionY = 136;
  this.torqueX = 0;
  this.torqueY = 0;

  this.down = false;
  this.upsideDown = false;

  this.previousPositionX = 0;
  this.previousPositionY = 0;

  this.currentSide = 0;
  this.calculatedSide = 0;


  bindEvent(document, 'mousedown', function() {
    self.down = true;
  });

  bindEvent(document, 'mouseup', function() {
    self.down = false;
  });
  
  bindEvent(document, 'keyup', function() {
    self.down = false;
  });

  bindEvent(document, 'mousemove', function(e) {
    self.mouseX = e.pageX;
    self.mouseY = e.pageY;
  });

  bindEvent(document, 'touchstart', function(e) {

    self.down = true;
    e.touches ? e = e.touches[0] : null;
    self.mouseX = e.pageX / self.touchSensivity;
    self.mouseY = e.pageY / self.touchSensivity;
    self.lastX  = self.mouseX;
    self.lastY  = self.mouseY;
  });

  bindEvent(document, 'touchmove', function(e) {
    if(e.preventDefault) { 
      e.preventDefault();
    }

    if(e.touches.length == 1) {

      e.touches ? e = e.touches[0] : null;

      self.mouseX = e.pageX / self.touchSensivity;
      self.mouseY = e.pageY / self.touchSensivity;

    }
  });

  bindEvent(document, 'touchend', function(e) {
    self.down = false;
  });  

  ViewPortIntervalId = setInterval(this.animate.bind(this), this.fps);

}

eventsCube.implement(Viewport);
Viewport.prototype.animate = function() {

  this.distanceX = (this.mouseX - this.lastX);
  this.distanceY = (this.mouseY - this.lastY);

  this.lastX = this.mouseX;
  this.lastY = this.mouseY;

  if(this.down) {
    this.torqueX = this.torqueX * this.sensivityFade + (this.distanceX * this.speed - this.torqueX) * this.sensivity;
    this.torqueY = this.torqueY * this.sensivityFade + (this.distanceY * this.speed - this.torqueY) * this.sensivity;
  }

  if(Math.abs(this.torqueX) > 1.0 || Math.abs(this.torqueY) > 1.0) {
    if(!this.down) {
      this.torqueX *= this.sensivityFade;
      this.torqueY *= this.sensivityFade;
    }

    this.positionY -= this.torqueY;

    if(this.positionY > 360) {
      this.positionY -= 360;
    } else if(this.positionY < 0) {
      this.positionY += 360;
    }

    if(this.positionY > 90 && this.positionY < 270) {
      this.positionX -= this.torqueX;

      if(!this.upsideDown) {
        this.upsideDown = true;
        this.emit('upsideDown', { upsideDown: this.upsideDown });
      }

    } else {

      this.positionX += this.torqueX;

      if(this.upsideDown) {
        this.upsideDown = false;
        this.emit('upsideDown', { upsideDown: this.upsideDown });
      }
    }

    if(this.positionX > 360) {
      this.positionX -= 360;
    } else if(this.positionX < 0) {
      this.positionX += 360;
    }

    if(!(this.positionY >= 46 && this.positionY <= 130) && !(this.positionY >= 220 && this.positionY <= 308)) {
      if(this.upsideDown) {
        if(this.positionX >= 42 && this.positionX <= 130) {
          this.calculatedSide = 3;
        } else if(this.positionX >= 131 && this.positionX <= 223) {
          this.calculatedSide = 2;
        } else if(this.positionX >= 224 && this.positionX <= 314) {
          this.calculatedSide = 5;
        } else {
          this.calculatedSide = 4;
        }
      } else {
        if(this.positionX >= 42 && this.positionX <= 130) {
          this.calculatedSide = 5;
        } else if(this.positionX >= 131 && this.positionX <= 223) {
          this.calculatedSide = 4;
        } else if(this.positionX >= 224 && this.positionX <= 314) {
          this.calculatedSide = 3;
        } else {
          this.calculatedSide = 2;
        }
      }
    } else {
      if(this.positionY >= 46 && this.positionY <= 130) {
        this.calculatedSide = 6;
      }

      if(this.positionY >= 220 && this.positionY <= 308) {
        this.calculatedSide = 1;
      }
    }

    if(this.calculatedSide !== this.currentSide) {
      this.currentSide = this.calculatedSide;
      this.emit('sideChange');
    }

  }

  this.element.style[userPrefixCube.js + 'Transform'] = 'rotateX(' + this.positionY + 'deg) rotateY(' + this.positionX + 'deg)';

  if(this.positionY != this.previousPositionY || this.positionX != this.previousPositionX) {
    this.previousPositionY = this.positionY;
    this.previousPositionX = this.positionX;

    this.emit('rotate');

  }

}
