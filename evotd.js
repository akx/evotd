(function(){
  var toBits, fromBits, lerp, birand, rand, irand, pick, lissajous, genLissajousParams, makeAstarNode, aStar, Gene, EightBitGene, FloatGene, Genome, GridObject, Tower, Spawner, Heart, Boulder, Enemy, World, validGridCoords, gridMaxX, gridMaxY, world, time, towerGenome, enemyGenome;
  toBits = function(val, bits){
    var i, results$ = [];
    bits == null && (bits = 8);
    for (i = 0; i < bits; ++i) {
      results$.push(!!(val & 1 << i));
    }
    return results$;
  };
  fromBits = function(bits){
    var val, i, len$, bit;
    val = 0;
    for (i = 0, len$ = bits.length; i < len$; ++i) {
      bit = bits[i];
      if (bit) {
        val |= 1 << i;
      }
    }
    return val;
  };
  lerp = function(a, b, alpha){
    return b * alpha + a * (1 - alpha);
  };
  birand = function(a, b){
    return (a + Math.random() * (b - a)) * (Math.random() < 0.5
      ? -1
      : +1);
  };
  rand = function(a, b){
    return a + Math.random() * (b - a);
  };
  irand = function(a, b){
    return 0 | a + Math.random() * (b - a);
  };
  pick = function(arr){
    return arr[irand(0, arr.length)];
  };
  lissajous = function(ctx, time, ljParams){
    var w, z, Rr, phi, Rr_p, x, y, results$ = [];
    w = Math.cos(time * ljParams.wd);
    z = Math.sin(time * ljParams.zd);
    Rr = ljParams.R - ljParams.r;
    for (phi = 0; phi < 25; phi += 0.1) {
      Rr_p = Rr / ljParams.r * phi;
      x = Rr * Math.cos(phi) + ljParams.d * Math.cos(w + Rr_p);
      y = Rr * Math.sin(phi) - ljParams.d * Math.sin(z - Rr_p);
      if (phi == 0) {
        results$.push(ctx.moveTo(x, y));
      } else {
        results$.push(ctx.lineTo(x, y));
      }
    }
    return results$;
  };
  genLissajousParams = function(){
    return {
      R: 15 + Math.random() * 15,
      r: 5 + Math.random() * 10,
      d: Math.random() * 5,
      wd: birand(1.1, 1.4),
      zd: birand(1.1, 1.4)
    };
  };
  makeAstarNode = function(x, y){
    return {
      x: x,
      y: y,
      id: x + "," + y
    };
  };
  aStar = function(start, goal, getNeighbors, dist, heuristic){
    var closed, open, openIds, cameFrom, gScore, fScore, putOpen, setF, reconstructPath, current, i$, ref$, len$, neighbor, tentativeG;
    dist == null && (dist = null);
    heuristic == null && (heuristic = null);
    closed = {};
    open = [];
    openIds = {};
    cameFrom = {};
    gScore = {};
    fScore = {};
    heuristic = heuristic || function(node1, node2){
      return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
    };
    dist = dist || function(node1, node2){
      var dx, dy;
      dx = node1.x - node2.x;
      dy = node1.y - node2.y;
      return Math.sqrt(dx * dx + dy * dy);
    };
    putOpen = function(node, g){
      open.push(node);
      openIds[node.id] = 1;
      gScore[node.id] = g;
    };
    setF = function(node){
      fScore[node.id] = gScore[node.id] + heuristic(node, goal);
    };
    reconstructPath = function(){
      var current, path, next;
      current = goal;
      path = [];
      while (next = cameFrom[current.id]) {
        path.unshift(next);
        current = next;
      }
      return path;
    };
    putOpen(start, 0);
    setF(start);
    while (open.length) {
      open = open.sort(fn$);
      current = open.shift();
      delete openIds[current.id];
      if (current.id == goal.id) {
        return reconstructPath();
      }
      closed[current.id] = 1;
      for (i$ = 0, len$ = (ref$ = getNeighbors(current)).length; i$ < len$; ++i$) {
        neighbor = ref$[i$];
        if (closed[neighbor.id]) {
          continue;
        }
        tentativeG = gScore[current.id] + dist(current, neighbor);
        if (!openIds[neighbor.id] || tentativeG < gScore[neighbor.id]) {
          putOpen(neighbor, tentativeG);
          cameFrom[neighbor.id] = current;
          fScore[neighbor.id] = gScore[neighbor.id] + heuristic(neighbor, goal);
        }
      }
    }
    return null;
    function fn$(a, b){
      return fScore[a.id] - fScore[b.id];
    }
  };
  Gene = (function(){
    Gene.displayName = 'Gene';
    var prototype = Gene.prototype, constructor = Gene;
    prototype.initialize = function(){};
    prototype.evolve = function(a, b, mutation){
      mutation == null && (mutation = 0);
    };
    function Gene(){}
    return Gene;
  }());
  EightBitGene = (function(superclass){
    EightBitGene.displayName = 'EightBitGene';
    var prototype = extend$(EightBitGene, superclass).prototype, constructor = EightBitGene;
    prototype.initialize = function(){
      return Math.random();
    };
    prototype.evolve = function(a, b, mutation){
      var aBits, bBits, res$, i, v, cBits;
      mutation == null && (mutation = 0);
      aBits = eightBits(a * 255);
      bBits = eightBits(b * 255);
      res$ = [];
      for (i = 0; i < 8; ++i) {
        v = Math.random() < 0.5;
        if (Math.random() < mutation) {
          res$.push(v);
        } else if (v) {
          res$.push(aBits[i]);
        } else {
          res$.push(bBits[i]);
        }
      }
      cBits = res$;
      return fromBits(cBits) / 256;
    };
    function EightBitGene(){}
    return EightBitGene;
  }(Gene));
  FloatGene = (function(superclass){
    FloatGene.displayName = 'FloatGene';
    var prototype = extend$(FloatGene, superclass).prototype, constructor = FloatGene;
    prototype.initialize = function(){
      return Math.random();
    };
    prototype.evolve = function(a, b, mutation){
      mutation == null && (mutation = 0);
      if (Math.random() < mutation) {
        return this.initialize();
      }
      return lerp(a, b, rand(0.3, 0.7));
    };
    function FloatGene(){}
    return FloatGene;
  }(Gene));
  Genome = (function(){
    Genome.displayName = 'Genome';
    var prototype = Genome.prototype, constructor = Genome;
    function Genome(genes){
      this.genes = genes;
    }
    prototype.initialize = function(){
      var obj, name, ref$, attr;
      obj = {};
      for (name in ref$ = this.genes) {
        attr = ref$[name];
        obj[name] = attr.initialize();
      }
      return obj;
    };
    prototype.evolve = function(a, b, mutation){
      var obj, name, ref$, attr, attrA, attrB, value;
      mutation == null && (mutation = 0);
      obj = {};
      for (name in ref$ = this.genes) {
        attr = ref$[name];
        attrA = a[name];
        attrB = b[name];
        if (attrA !== undefined && attrB !== undefined) {
          value = attr.evolve(attrA, attrB, mutation);
        } else {
          value = attr.initialize();
        }
        obj[name] = value;
      }
      return obj;
    };
    return Genome;
  }());
  GridObject = (function(){
    GridObject.displayName = 'GridObject';
    var prototype = GridObject.prototype, constructor = GridObject;
    function GridObject(){
      this.gridX = this.gridY = this.x = this.y = 0;
    }
    prototype.setGridCoords = function(gridX, gridY){
      this.x = (this.gridX = 0 | gridX) * 32 + 16;
      this.y = (this.gridY = 0 | gridY) * 32 + 16;
    };
    prototype.updateGridCoordsFromXY = function(){
      this.gridX = 0 | this.x / 32;
      this.gridY = 0 | this.y / 32;
    };
    return GridObject;
  }());
  Tower = (function(superclass){
    Tower.displayName = 'Tower';
    var prototype = extend$(Tower, superclass).prototype, constructor = Tower;
    function Tower(attributes){
      this.attributes = attributes;
      superclass.call(this);
    }
    prototype.draw = function(ctx){
      var hue, pxHeight, baseWidth, topWidth, i, sz;
      hue = 0 | this.attributes.hue * 360;
      pxHeight = 8 + this.attributes.height * 48;
      baseWidth = 3 + this.attributes.baseWidth * 27;
      topWidth = 3 + this.attributes.topWidth * 17;
      ctx.beginPath();
      ctx.fillStyle = "hsl(" + hue + ",100%,50%)";
      ctx.strokeStyle = "transparent";
      for (i = 0; i < pxHeight; i += 3) {
        sz = lerp(topWidth, baseWidth, 1.0 - i / pxHeight);
        ctx.arc(0, -i, sz / 2, 0, 6.282);
      }
      ctx.fill();
    };
    return Tower;
  }(GridObject));
  Spawner = (function(superclass){
    Spawner.displayName = 'Spawner';
    var prototype = extend$(Spawner, superclass).prototype, constructor = Spawner;
    function Spawner(){
      superclass.call(this);
      this.ljParams = genLissajousParams();
      this.figureOutNextSpawn();
    }
    prototype.figureOutNextSpawn = function(){
      this.nextSpawn = time + rand(1, 5);
    };
    prototype.draw = function(ctx){
      ctx.save();
      ctx.rotate(time);
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      lissajous(ctx, time, this.ljParams);
      ctx.stroke();
      ctx.restore();
    };
    prototype.step = function(){
      if (this.nextSpawn && time >= this.nextSpawn) {
        this.nextSpawn = 0;
        this.spawn();
      }
    };
    prototype.spawn = function(){
      var genome, creep;
      if (world.creeps.length) {
        genome = enemyGenome.evolve(pick(world.creeps), pick(world.creeps), world.mutationRate);
      } else {
        genome = enemyGenome.initialize();
      }
      creep = new Enemy(genome);
      creep.setGridCoords(this.gridX, this.gridY);
      creep.reroute();
      world.creeps.push(creep);
    };
    return Spawner;
  }(GridObject));
  Heart = (function(superclass){
    Heart.displayName = 'Heart';
    var prototype = extend$(Heart, superclass).prototype, constructor = Heart;
    function Heart(){
      superclass.call(this);
      this.ljParams = genLissajousParams();
    }
    prototype.draw = function(ctx){
      ctx.save();
      ctx.rotate(-time);
      ctx.beginPath();
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 1;
      lissajous(ctx, time, this.ljParams);
      ctx.stroke();
      ctx.restore();
    };
    return Heart;
  }(GridObject));
  Boulder = (function(superclass){
    Boulder.displayName = 'Boulder';
    var prototype = extend$(Boulder, superclass).prototype, constructor = Boulder;
    function Boulder(){
      superclass.call(this);
      this.blocking = true;
    }
    prototype.draw = function(ctx){
      ctx.beginPath();
      ctx.fillStyle = "#444";
      ctx.strokeStyle = "silver";
      ctx.lineWidth = 2;
      ctx.rect(-12, -12, 24, 24);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = "#666";
      ctx.rect(-12, -24, 24, 24);
      ctx.fill();
      ctx.stroke();
    };
    return Boulder;
  }(GridObject));
  Enemy = (function(superclass){
    Enemy.displayName = 'Enemy';
    var prototype = extend$(Enemy, superclass).prototype, constructor = Enemy;
    function Enemy(attributes){
      this.attributes = attributes;
      superclass.call(this);
      this.route = null;
    }
    prototype.draw = function(ctx){
      ctx.beginPath();
      ctx.fillStyle = "yellow";
      ctx.rect(-3, -3, 6, 6);
      ctx.fill();
    };
    prototype.step = function(){
      var lastTime, delta, speed, nextNode, dx, dy, dir;
      lastTime = this.lastTime || time;
      delta = time - lastTime;
      speed = this.attributes.speed * 4;
      if (this.route && this.route.length) {
        nextNode = this.route[0];
        dx = this.x - nextNode.worldX;
        dy = this.y - nextNode.worldY;
        if (dx * dx + dy * dy < 5 * 5) {
          this.route.unshift();
        } else {
          dir = Math.atan2(dy, dx);
          this.x += Math.cos(dir) * speed;
          this.y += Math.sin(dir) * speed;
        }
      }
      this.lastTime = time;
    };
    prototype.reroute = function(){
      var start, end, route, i$, len$, point;
      this.updateGridCoordsFromXY();
      start = makeAstarNode(this.gridX, this.gridY);
      end = makeAstarNode(world.heart.gridX, world.heart.gridY);
      route = aStar(start, end, bind$(world, 'getAstarNeighbors'));
      route = route || [end];
      for (i$ = 0, len$ = route.length; i$ < len$; ++i$) {
        point = route[i$];
        point.worldX = point.x + irand(4, 28);
        point.worldY = point.y + irand(4, 28);
      }
      this.route = route;
    };
    return Enemy;
  }(GridObject));
  World = (function(){
    World.displayName = 'World';
    var prototype = World.prototype, constructor = World;
    function World(){
      this.towers = [];
      this.creeps = [];
      this.ammo = [];
      this.towerTray = [];
      this.objs = [];
      this.mutationRate = 0.02;
      this.heart = null;
    }
    prototype.getAstarNeighbors = function(node){
      var x, y, neighbors, w;
      x = node.x, y = node.y;
      neighbors = [];
      if (x > 0) {
        neighbors.push(makeAstarNode(x - 1, y));
      }
      if (y > 0) {
        neighbors.push(makeAstarNode(x, y - 1));
      }
      if (x < gridMaxX) {
        neighbors.push(makeAstarNode(x + 1, y));
      }
      if (y < gridMaxY) {
        neighbors.push(makeAstarNode(x, y + 1));
      }
      w = this;
      neighbors = neighbors.filter(function(node){
        return w.isPlaceable(node.x, node.y);
      });
      return neighbors;
    };
    prototype._checkGridObj = function(arrGridObjs, gridX, gridY, blockingOnly){
      var i$, len$, obj;
      blockingOnly == null && (blockingOnly = false);
      for (i$ = 0, len$ = arrGridObjs.length; i$ < len$; ++i$) {
        obj = arrGridObjs[i$];
        if (obj.gridX == gridX && obj.gridY == gridY && (!blockingOnly || (blockingOnly && obj.blocking))) {
          return obj;
        }
      }
    };
    prototype.isPlaceable = function(gridX, gridY){
      return !this._checkGridObj(this.towers, gridX, gridY) && !this._checkGridObj(this.objs, gridX, gridY, true);
    };
    prototype.placeTower = function(tower, gridX, gridY){
      var i, to$, i$, ref$, len$, creep, results$ = [];
      for (i = 0, to$ = this.towerTray.length; i < to$; ++i) {
        if (this.towerTray[i] == tower) {
          this.towerTray.splice(i, 1);
          break;
        }
      }
      tower.setGridCoords(gridX, gridY);
      this.towers.push(tower);
      for (i$ = 0, len$ = (ref$ = this.creeps).length; i$ < len$; ++i$) {
        creep = ref$[i$];
        results$.push(creep.reroute());
      }
      return results$;
    };
    prototype._process = function(aDrawables){
      var i, d;
      i = 0;
      while (i < aDrawables.length) {
        d = aDrawables[i];
        if (typeof d.step == 'function') {
          d.step();
        }
        if (d.dead) {
          console.log("Killing " + d);
          aDrawables.splice(i, 1);
          continue;
        }
        i += 1;
      }
      return aDrawables;
    };
    prototype.draw = function(ctx){
      var drawables, i$, len$, d, results$ = [];
      drawables = [].concat(this._process(this.towers), this._process(this.objs), this._process(this.creeps), this._process(this.ammo));
      drawables.sort(function(a, b){
        return a.y - b.y;
      });
      for (i$ = 0, len$ = drawables.length; i$ < len$; ++i$) {
        d = drawables[i$];
        ctx.translate(d.x, d.y);
        d.draw(ctx);
        results$.push(ctx.translate(-d.x, -d.y));
      }
      return results$;
    };
    prototype.newGame = function(){
      var x, spawner, heart, i, boulder, y;
      for (x = 0; x < 5; ++x) {
        this.towerTray.push(new Tower(towerGenome.initialize()));
      }
      spawner = new Spawner();
      spawner.setGridCoords(0, 0 | Math.random() * gridMaxY - 1);
      this.objs.push(spawner);
      this.heart = heart = new Heart();
      heart.setGridCoords(gridMaxX - 1, 0 | Math.random() * gridMaxY - 1);
      this.objs.push(heart);
      for (i = 0; i < 5; ++i) {
        boulder = new Boulder();
        x = irand(3, gridMaxX - 3);
        y = irand(0, gridMaxY - 1);
        for (;;) {
          if (this.isPlaceable(x, y)) {
            boulder.setGridCoords(x, y);
            break;
          }
        }
        this.objs.push(boulder);
      }
    };
    return World;
  }());
  validGridCoords = function(gridX, gridY){
    return gridX >= 0 && gridX < gridMaxX && gridY >= 0 && gridY < gridMaxY;
  };
  gridMaxX = 25;
  gridMaxY = 17;
  world = null;
  time = 0;
  towerGenome = new Genome({
    height: new FloatGene(),
    baseWidth: new FloatGene(),
    topWidth: new FloatGene(),
    form: new FloatGene(),
    range: new FloatGene(),
    hue: new FloatGene(),
    ammoSpeed: new FloatGene(),
    reloadSpeed: new FloatGene(),
    acquisitionSpeed: new FloatGene()
  });
  enemyGenome = new Genome({
    speed: new FloatGene(),
    health: new FloatGene(),
    size: new FloatGene(),
    flying: new FloatGene()
  });
  (function(document, window){
    var canvas, ctx, mouse, traySelected, worldSelected, tooltipText, setTooltip, drawScene, drawTray, draw, click, step, newGame, init;
    canvas = null;
    ctx = null;
    mouse = {
      b: false,
      x: 0,
      y: 0,
      down: {}
    };
    traySelected = null;
    worldSelected = null;
    tooltipText = null;
    setTooltip = function(it){
      tooltipText = it + "";
    };
    drawScene = function(){
      var x, y, p, worldSelectedChanged, canEvolve, i$, ref$, len$, tower, evTower;
      ctx.beginPath();
      ctx.strokeStyle = "purple";
      ctx.lineWidth = 1;
      for (x = 0; x < 800; x += 32) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, 544);
      }
      for (y = 0; y < 544; y += 32) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(800, y + 0.5);
      }
      ctx.stroke();
      if (traySelected) {
        if (validGridCoords(mouse.gridX, mouse.gridY)) {
          p = world.isPlaceable(mouse.gridX, mouse.gridY);
          ctx.beginPath();
          ctx.strokeStyle = p ? "white" : "red";
          ctx.lineWidth = 2;
          ctx.rect(mouse.gridX * 32, mouse.gridY * 32, 32, 32);
          ctx.stroke();
          if (p) {
            setTooltip("Place tower");
          }
        }
      }
      worldSelectedChanged = false;
      canEvolve = world.towerTray.length < 10;
      if (!traySelected) {
        for (i$ = 0, len$ = (ref$ = world.towers).length; i$ < len$; ++i$) {
          tower = ref$[i$];
          if (worldSelected == tower || tower.gridX == mouse.gridX && tower.gridY == mouse.gridY) {
            ctx.beginPath();
            ctx.strokeStyle = worldSelected == tower ? "magenta" : "purple";
            if (worldSelected && worldSelected != tower) {
              if (canEvolve) {
                ctx.strokeStyle = "magenta";
                setTooltip("Evolve towers");
              } else {
                ctx.strokeStyle = "red";
                setTooltip("Can't evolve, too many in tray");
              }
            }
            ctx.lineWidth = 4;
            ctx.rect(tower.gridX * 32, tower.gridY * 32, 32, 32);
            ctx.stroke();
            if (mouse.b) {
              if (canEvolve && worldSelected && worldSelected != tower) {
                evTower = new Tower(towerGenome.evolve(worldSelected.attributes, tower.attributes, world.mutationRate));
                world.towerTray.push(evTower);
                worldSelected = null;
              } else {
                worldSelected = tower;
                worldSelectedChanged = true;
              }
            }
          }
        }
      }
      return world.draw(ctx);
    };
    drawTray = function(){
      var i, ref$, len$, tower, tx;
      ctx.strokeStyle = "cyan";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 544);
      ctx.lineTo(800, 544);
      ctx.stroke();
      for (i = 0, len$ = (ref$ = world.towerTray).length; i < len$; ++i) {
        tower = ref$[i];
        ctx.save();
        tx = 16 + i * 32;
        ctx.translate(tx, 585);
        if (mouse.x >= tx - 16 && mouse.x < tx + 16 && mouse.y > 544 || traySelected == tower) {
          if (traySelected != tower) {
            setTooltip("Select tower to place");
          }
          if (mouse.b) {
            traySelected = tower;
            worldSelected = null;
          }
          ctx.beginPath();
          ctx.strokeStyle = tower == traySelected ? "white" : "magenta";
          ctx.rect(-15, -15, 30, 30);
          ctx.stroke();
        }
        tower.draw(ctx);
        ctx.restore();
      }
    };
    draw = function(){
      var w, ttX, ttY;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, 800, 600);
      tooltipText = null;
      drawScene();
      drawTray();
      if (tooltipText) {
        ctx.font = "12px Segoe UI, sans-serif";
        w = ctx.measureText(tooltipText).width;
        ttX = mouse.x + 10;
        if (ttX + w + 5 > 800) {
          ttX = mouse.x - 10 - w;
        }
        ttY = Math.min(580, mouse.y - 5);
        ttX += 0.5;
        ttY += 0.5;
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(ttX, ttY, w + 6, 16);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillText(tooltipText, ttX + 2, ttY + 12);
      }
    };
    click = function(){
      var gridX, gridY;
      gridX = mouse.gridX;
      gridY = mouse.gridY;
      if (traySelected) {
        if (validGridCoords(gridX, gridY)) {
          if (traySelected && world.isPlaceable(gridX, gridY)) {
            world.placeTower(traySelected, gridX, gridY);
          }
          traySelected = null;
        }
      }
      if (worldSelected && validGridCoords(gridX, gridY) && world.isPlaceable(gridX, gridY)) {
        worldSelected = null;
      }
    };
    step = function(){
      time += 1 / 30.0;
      return draw();
    };
    newGame = function(){
      world = new World();
      return world.newGame();
    };
    init = function(){
      var $, handleMove;
      $ = function(it){
        return document.getElementById(it);
      };
      canvas = $("canvas");
      ctx = canvas.getContext("2d");
      handleMove = function(into, event){
        var gx, gy;
        into.x = event.offsetX;
        into.y = event.offsetY;
        gx = 0 | into.x / 32;
        gy = 0 | into.y / 32;
        if (validGridCoords(gx, gy)) {
          into.gridX = gx;
          return into.gridY = gy;
        } else {
          return into.gridX = into.gridY = -1;
        }
      };
      canvas.addEventListener("mousedown", function(event){
        mouse.b = true;
        handleMove(mouse, event);
        handleMove(mouse.down, event);
      });
      canvas.addEventListener("mouseup", function(event){
        mouse.b = false;
        handleMove(mouse, event);
      });
      canvas.addEventListener("mousemove", function(event){
        handleMove(mouse, event);
      });
      canvas.addEventListener("click", function(event){
        handleMove(mouse, event);
        click();
      });
      newGame();
      return setInterval(step, 1000 / 20.0);
    };
    window.EvoTD = {
      init: init
    };
  }.call(this, document, window));
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function bind$(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
