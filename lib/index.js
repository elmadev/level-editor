"use strict";

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.array.find-index");

require("core-js/modules/es6.array.find");

require("core-js/modules/es6.array.map");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Level = require("../lib/node-elma").Level;

var LevelEditor =
/*#__PURE__*/
function () {
  function LevelEditor() {
    _classCallCheck(this, LevelEditor);
  }

  _createClass(LevelEditor, [{
    key: "newLevel",
    value: function newLevel() {
      this.initLevel(new Level());
    }
  }, {
    key: "loadLevel",
    value: function loadLevel(path) {
      var _this = this;

      return Level.load(path).then(function (level) {
        _this.initLevel(level);
      });
    }
  }, {
    key: "initLevel",
    value: function initLevel(level) {
      var _this2 = this;

      level.polygons.map(function (p) {
        p.id = _this2.uuidv4();
        p.vertices.map(function (v) {
          v.id = _this2.uuidv4();
        });
      });
      level.objects.map(function (o) {
        o.id = _this2.uuidv4();
      });
      this.level = level;
    }
  }, {
    key: "setLgr",
    value: function setLgr(filename) {
      this.level.lgr = filename;
    }
  }, {
    key: "setGround",
    value: function setGround(textureName) {
      this.level.ground = textureName;
    }
  }, {
    key: "setSky",
    value: function setSky(textureName) {
      this.level.sky = textureName;
    }
  }, {
    key: "setName",
    value: function setName(name) {
      this.level.name = name;
    }
  }, {
    key: "createPolygon",
    value: function createPolygon(vertices, grass) {
      var _this3 = this;

      var uid = this.uuidv4();
      vertices.map(function (v) {
        v.id = _this3.uuidv4();
      });
      var p = {
        id: uid,
        grass: grass || false,
        vertices: vertices
      };
      this.level.polygons.push(p);

      if (this._connected) {
        this._socket.emit("createpolygon", p);
      }

      return p;
    }
  }, {
    key: "updateVertex",
    value: function updateVertex(vertex, polygon, x, y) {
      vertex.x = x;
      vertex.y = y;

      if (this._connected) {
        this._socket.emit("updatevertex", {
          id: vertex.id,
          polygonId: polygon.id,
          x: x,
          y: y
        });
      }
    }
  }, {
    key: "updateObject",
    value: function updateObject(obj, x, y) {
      obj.x = x;
      obj.y = y;

      if (this._connected) {
        this._socket.emit("updateobject", {
          id: obj.id,
          x: x,
          y: y
        });
      }
    }
  }, {
    key: "createVertex",
    value: function createVertex(x, y, polygon, afterVertexId, direction) {
      var uid = this.uuidv4();
      var v = {
        id: uid,
        x: x,
        y: y
      };

      if (afterVertexId) {
        polygon.vertices.splice(this.findVertexIndex(afterVertexId, polygon) + direction, 0, v);
      } else {
        polygon.vertices.push(v);
      }

      if (this._connected) {
        this._socket.emit("createvertex", {
          id: uid,
          x: x,
          y: y,
          polygonId: polygon.id,
          afterVertexId: afterVertexId,
          direction: direction
        });
      }

      return v;
    }
  }, {
    key: "createObject",
    value: function createObject(x, y, type, gravity, animation) {
      var uid = this.uuidv4();
      var o = {
        id: uid,
        x: x,
        y: y,
        type: type,
        gravity: gravity,
        animation: animation
      };
      this.level.objects.push(o);

      if (this._connected) {
        this._socket.emit("createobject", o);
      }

      return o;
    }
  }, {
    key: "createPicture",
    value: function createPicture(name, texture, mask, x, y, distance, clip) {
      var uid = this.uuidv4();
      var p = {
        id: uid,
        name: name,
        texture: texture,
        mask: mask,
        x: x,
        y: y,
        distance: distance,
        clip: clip
      };
      this.level.pictures.push(p);
      return p;
    }
  }, {
    key: "deletePicture",
    value: function deletePicture(id) {
      this.level.pictures.splice(this.findPictureIndex(id), 1);
    }
  }, {
    key: "deleteVertex",
    value: function deleteVertex(polygon, id) {
      polygon.vertices.splice(this.findVertexIndex(id, polygon), 1);
      if (this._connected) this._socket.emit("deletevertex", {
        id: id,
        polygonId: polygon.id
      });
    }
  }, {
    key: "deletePolygon",
    value: function deletePolygon(id) {
      this.level.polygons.splice(this.findPolygonIndex(id), 1);
      if (this._connected) this._socket.emit("deletepolygon", id);
    }
  }, {
    key: "deleteObject",
    value: function deleteObject(id) {
      this.level.objects.splice(this.findObjectIndex(id), 1);
      if (this._connected) this._socket.emit("deleteobject", id);
    }
  }, {
    key: "findPolygon",
    value: function findPolygon(id) {
      var p = this.level.polygons.find(function (p) {
        return p.id === id;
      });
      if (!p) throw "polygon not found";
      return p;
    }
  }, {
    key: "findPolygonIndex",
    value: function findPolygonIndex(id) {
      var p = this.level.polygons.findIndex(function (p) {
        return p.id === id;
      });
      if (p < 0) throw "polygon not found";
      return p;
    }
  }, {
    key: "findPicture",
    value: function findPicture(id) {
      var p = this.level.pictures.find(function (p) {
        return p.id === id;
      });
      if (!p) throw "picture not found";
      return p;
    }
  }, {
    key: "findPictureIndex",
    value: function findPictureIndex(id) {
      var p = this.level.pictures.findIndex(function (p) {
        return p.id === id;
      });
      if (p < 0) throw "picture not found";
      return p;
    }
  }, {
    key: "findVertex",
    value: function findVertex(id, polygon) {
      var v = polygon.vertices.find(function (v) {
        return v.id === id;
      });
      if (!v) throw "vertex not found";
      return v;
    }
  }, {
    key: "findVertexIndex",
    value: function findVertexIndex(id, polygon) {
      var v = polygon.vertices.findIndex(function (v) {
        return v.id === id;
      });
      if (v < 0) throw "vertex not found";
      return v;
    }
  }, {
    key: "findObject",
    value: function findObject(id) {
      var o = this.level.objects.find(function (o) {
        return o.id === id;
      });
      if (!o) throw "object not found";
      return o;
    }
  }, {
    key: "findObjectIndex",
    value: function findObjectIndex(id) {
      var o = this.level.objects.findIndex(function (o) {
        return o.id === id;
      });
      if (o < 0) throw "object not found";
      return o;
    }
    /**
     * Generate uuid
     * https://stackoverflow.com/a/2117523
     */

  }, {
    key: "uuidv4",
    value: function uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == "x" ? r : r & 0x3 | 0x8;
        return v.toString(16);
      });
    }
  }, {
    key: "exportLevel",
    value: function exportLevel(path) {
      this.level.save(path);
    }
  }, {
    key: "createBinary",
    value: function createBinary() {
      return this.level.toBuffer();
    }
  }, {
    key: "joinRoom",
    value: function joinRoom(room) {
      if (!this._connected) throw "client is not connected to a server";

      this._socket.emit("joinroom", room);
    }
  }, {
    key: "connect",
    value: function connect(server) {
      var _this4 = this;

      var io = require("socket.io-client");

      this._socket = io(server);

      this._socket.on("connect", function () {
        _this4._connected = true;
      });

      this._socket.on("createvertex", function (v) {
        var polygon = _this4.findPolygon(v.polygonId);

        if (v.afterVertexId) {
          polygon.vertices.splice(_this4.findVertexIndex(v.afterVertexId, polygon) + v.direction, 0, v);
        } else {
          polygon.vertices.push(v);
        }
      });

      this._socket.on("createpolygon", function (p) {
        _this4.level.polygons.push(p);
      });

      this._socket.on("createobject", function (o) {
        _this4.level.objects.push(o);
      });

      this._socket.on("deletevertex", function (v) {
        var polygon = _this4.findPolygon(v.polygonId);

        polygon.vertices.splice(_this4.findVertexIndex(v.id, polygon), 1);
      });

      this._socket.on("updatevertex", function (v) {
        var vertex = _this4.findVertex(v.id, _this4.findPolygon(v.polygonId));

        vertex.x = v.x;
        vertex.y = v.y;
      });

      this._socket.on("updateobject", function (o) {
        var obj = _this4.findObject(o.id);

        obj.x = o.x;
        obj.y = o.y;
      });

      this._socket.on("deletepolygon", function (p) {
        _this4.level.polygons.splice(_this4.findPolygonIndex(p), 1);
      });

      this._socket.on("deleteobject", function (o) {
        _this4.level.objects.splice(_this4.findObjectIndex(o), 1);
      });

      this._socket.on("requestlevel", function (clientId) {
        _this4._socket.emit("responselevel", {
          level: _this4.level,
          clientId: clientId
        });
      });

      this._socket.on("responselevel", function (l) {
        var level = new Level();
        level.polygons = l.polygons;
        level.objects = l.objects;
        _this4.level = level;
      });
    }
  }]);

  return LevelEditor;
}();

module.exports = LevelEditor;