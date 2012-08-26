(function(){
  var toBits, fromBits, lerp, birand, rand, irand, pick, rangeCheck, lissajous, genLissajousParams, fontStack, makeAstarNode, aStar, sounds, enableSound, loadSound, playSound, Gene, EightBitGene, FloatGene, Genome, GridObject, Tower, Spawner, Heart, Boulder, Enemy, Shot, World, validGridCoords, gridMaxX, gridMaxY, world, time, debug, towerGenome, traitNames, enemyGenome;
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
  rangeCheck = function(p1, p2, maxRange){
    var dx, dy;
    dx = p1.x - p2.x;
    dy = p1.y - p2.y;
    return dx * dx + dy * dy < maxRange * maxRange;
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
  fontStack = "Corbel, Segoe UI, Frutiger Linotype, sans-serif";
  makeAstarNode = function(x, y){
    return {
      x: x,
      y: y,
      id: x + "," + y
    };
  };
  aStar = function(start, goal, getNeighbors){
    var closed, open, openIds, cameFrom, gScore, fScore, heuristic, dist, putOpen, setF, reconstructPath, current, i$, ref$, len$, neighbor, tentativeG;
    closed = {};
    open = [];
    openIds = {};
    cameFrom = {};
    gScore = {};
    fScore = {};
    heuristic = function(node1, node2){
      return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
    };
    dist = function(node1, node2){
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
  sounds = {};
  enableSound = true;
  loadSound = function(name, url){
    var audio;
    audio = new Audio();
    audio.setAttribute("src", url);
    audio.load();
    return sounds[name] = audio;
  };
  playSound = function(name){
    var sound;
    if (!enableSound) {
      return;
    }
    sound = sounds[name];
    return sound.play();
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
      a = a.attributes || a;
      b = b.attributes || b;
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
      var hue;
      this.attributes = attributes;
      superclass.call(this);
      this.nextReload = 0;
      this.nextShot = 0;
      this.nextAcquisition = 0;
      this.health = this.maxHealth = 5;
      this.damageBlip = false;
      this.generation = 0;
      this.actual = {
        maxAmmo: 0 | lerp(1, 50, this.attributes.reloadAmmo),
        shotInterval: 1.0 / lerp(3, 20, this.attributes.shootSpeed),
        acqInterval: lerp(4, 0.3, this.attributes.acquisitionSpeed),
        maxRange: 0 | lerp(48, 200, this.attributes.maxRange),
        reloadTime: lerp(1, 5, this.attributes.reloadSpeed),
        ammoDamage: lerp(1, 35, this.attributes.ammoDamage),
        ammoSpeed: lerp(3, 20, this.attributes.ammoSpeed),
        ammoRange: lerp(80, 400, this.attributes.ammoRange),
        ammoDeceleration: this.attributes.ammoDeceleration,
        slowingAmmo: this.attributes.slowingAmmo > 0.75,
        homingAmmo: this.attributes.homingAmmo > 0.85
      };
      this.actual.dps = this.actual.ammoDamage / (1.0 / this.actual.shotInterval);
      this.depletionTime = this.actual.maxAmmo * this.actual.shotInterval + 0.1;
      this.reload();
      hue = 0 | this.attributes.hue * 360;
      this.fillStyle = "hsl(" + hue + ",100%,50%)";
    }
    prototype.reload = function(){
      this.ammo = this.actual.maxAmmo;
      this.nextShot = 0;
      this.nextReload = 0;
      return this.reloading = false;
    };
    prototype.beginReload = function(){
      this.reloading = true;
      return this.nextReload = time + this.depletionTime + this.actual.reloadTime;
    };
    prototype.reacquire = function(){
      var closestEnemy, closestDist, maxDistSq, i$, ref$, len$, enemy, dx, dy, distSq;
      this.unacquire();
      closestEnemy = null;
      closestDist = 0;
      maxDistSq = this.actual.maxRange * this.actual.maxRange;
      for (i$ = 0, len$ = (ref$ = world.creeps).length; i$ < len$; ++i$) {
        enemy = ref$[i$];
        dx = this.x - enemy.x;
        dy = this.y - enemy.y;
        distSq = dx * dx + dy * dy;
        if ((!closestEnemy || distSq < closestDist) && distSq < maxDistSq) {
          closestDist = distSq;
          closestEnemy = enemy;
        }
      }
      this.acquiredEnemy = closestEnemy;
      return this.nextShot = time + this.actual.shotInterval;
    };
    prototype.unacquire = function(){
      this.acquiredEnemy = null;
      this.nextAcquisition = time + this.actual.acqInterval;
    };
    prototype.step = function(){
      this.onStage = true;
      if (time >= this.nextAcquisition) {
        this.reacquire();
      }
      if (this.ammo <= 0) {
        if (this.nextReload <= 0) {
          this.beginReload();
        } else if (time >= this.nextReload) {
          this.reload();
        }
      }
      if (this.acquiredEnemy) {
        if (!rangeCheck(this, this.acquiredEnemy, this.actual.maxRange)) {
          return this.unacquire();
        } else if (this.ammo > 0 && time >= this.nextShot) {
          this.nextShot = time + this.actual.shotInterval;
          if (this.acquiredEnemy.dead) {
            return this.acquiredEnemy = null;
          } else {
            this.shoot(this.acquiredEnemy);
            return this.ammo--;
          }
        }
      }
    };
    prototype.shoot = function(target){
      var shot;
      shot = new Shot(this.x, this.y, this.fillStyle, this.actual, target);
      world.ammo.push(shot);
      return playSound("shoot");
    };
    prototype.draw = function(ctx){
      var pxHeight, baseWidth, topWidth, i, alpha, sz, hue, abw;
      pxHeight = 8 + this.attributes.height * 48;
      baseWidth = 3 + this.attributes.baseWidth * 27;
      topWidth = 3 + this.attributes.topWidth * 17;
      ctx.font = "12px " + fontStack;
      ctx.strokeStyle = "transparent";
      for (i = 0; i < pxHeight; i += 3) {
        alpha = 1.0 - i / pxHeight;
        alpha = Math.pow(alpha, this.attributes.form * 2);
        sz = lerp(topWidth, baseWidth, alpha);
        hue = lerp(this.attributes.hue * 360, this.attributes.hueTop * 360, alpha);
        ctx.fillStyle = this.damageBlip
          ? "white"
          : "hsl(" + hue + ", 100%, 50%)";
        ctx.beginPath();
        ctx.arc(0, -i, sz / 2, 0, 6.282);
        ctx.fill();
      }
      this.damageBlip = false;
      if (this.onStage) {
        if (this.ammo > 0) {
          ctx.beginPath();
          abw = lerp(0, 32, this.ammo / this.actual.maxAmmo);
          ctx.rect(-16, 14, abw, 2);
          ctx.fill();
        }
        ctx.fillStyle = "white";
        if (this.reloading && time * 2 & 1) {
          ctx.beginPath();
          ctx.fillText("R", -2, 0);
        }
        if (!this.reloading && !this.acquiredEnemy) {
          ctx.beginPath();
          ctx.fillText("?", -2, 0);
        }
      }
    };
    prototype.damage = function(){
      this.health--;
      this.damageBlip = true;
      playSound("tower-hurt");
      if (this.health <= 0) {
        return this.dead = true;
      }
    };
    return Tower;
  }(GridObject));
  Spawner = (function(superclass){
    Spawner.displayName = 'Spawner';
    var prototype = extend$(Spawner, superclass).prototype, constructor = Spawner;
    function Spawner(){
      superclass.call(this);
      this.ljParams = genLissajousParams();
      this.figureOutNextSpawn(5);
      this.pool = [enemyGenome.initialize(), enemyGenome.initialize(), enemyGenome.initialize(), enemyGenome.initialize(), enemyGenome.initialize()];
      this.enemiesLeft = this.enemiesTotal = 300;
      this.enemiesSpawned = 0;
    }
    prototype.figureOutNextSpawn = function(multiplier){
      var ival;
      multiplier == null && (multiplier = 1);
      ival = rand(0.75, 4) * multiplier;
      return this.nextSpawn = time + ival;
    };
    prototype.draw = function(ctx){
      var timeToNextSpawn;
      ctx.save();
      ctx.rotate(time);
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      lissajous(ctx, time, this.ljParams);
      ctx.stroke();
      ctx.restore();
      if (this.nextSpawn > 0) {
        timeToNextSpawn = Math.min(1, (this.nextSpawn - time) / 5);
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.arc(0, 0, 8 + Math.cos(time) * 4, 0, lerp(0, 6.282, timeToNextSpawn));
        ctx.stroke();
      }
    };
    prototype.step = function(){
      if (!world.gameOver && this.enemiesLeft && this.nextSpawn && time >= this.nextSpawn) {
        this.figureOutNextSpawn();
        this.spawn();
      }
    };
    prototype.spawn = function(){
      var pool, genome, creep;
      this.enemiesLeft--;
      this.enemiesSpawned++;
      pool = [].concat(this.pool).concat(world.creeps);
      if (pool.length && Math.random() > 0.95) {
        genome = enemyGenome.evolve(pick(pool), pick(pool), world.enemyMutationRate);
      } else {
        genome = enemyGenome.initialize();
      }
      creep = new Enemy(genome);
      creep.spawner = this;
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
      this.health = this.maxHealth = 50;
      this.damageBlip = 0;
    }
    prototype.damage = function(){
      this.health--;
      this.damageBlip = 15;
      playSound("core-hit");
    };
    prototype.draw = function(ctx){
      ctx.strokeStyle = "lime";
      if (this.life < this.maxLife * 0.5 && time * 3 % 1 < 0.5) {
        ctx.strokeStyle = "orange";
      }
      if (this.damageBlip > 0) {
        this.damageBlip--;
        if (time * 5 % 1 < 0.5) {
          ctx.strokeStyle = "white";
        }
      }
      ctx.save();
      ctx.rotate(-time);
      ctx.beginPath();
      ctx.lineWidth = 1;
      lissajous(ctx, time, this.ljParams);
      ctx.stroke();
      ctx.restore();
      if (this.life < this.maxLife) {
        ctx.strokeStyle = "white";
        ctx.save();
        ctx.rotate(time * 3);
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.arc(0, 0, 8 + Math.cos(time) * 2, 0, lerp(0, 6.282, this.life / this.maxLife));
        ctx.stroke();
        ctx.restore();
      }
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
      this.actualSpeed = lerp(2, 12, this.attributes.speed) * Math.sqrt(this.attributes.health);
      this.actualSize = lerp(6, 32, this.attributes.size) / 2;
      this.maxHealth = this.health = 0 | lerp(30, 500, this.attributes.health);
      this.dx = this.dy = 0;
    }
    prototype.draw = function(ctx){
      var hue, r, s, abw;
      hue = 0 | this.attributes.hue * 360;
      r = (this.attributes.hue - 0.5) * time * (1 + this.attributes.speed) * 10;
      s = "hsl(" + hue + ", 30%, 50%)";
      ctx.beginPath();
      if (this.damageBlip) {
        s = "white";
        this.damageBlip = false;
      }
      ctx.fillStyle = ctx.strokeStyle = s;
      ctx.lineWidth = this.rage && (time * 3) % 1 < 0.5 ? 6 : 2;
      ctx.arc(0, 0, this.actualSize, r, r + 4.7);
      ctx.stroke();
      if (this.health > 0 && this.health < this.maxHealth) {
        ctx.beginPath();
        abw = lerp(0, 32, this.health / this.maxHealth);
        ctx.rect(-16, 14, abw, 2);
        ctx.fill();
      }
    };
    prototype.step = function(){
      var lastTime, delta, nextNode, dx, dy, dist2, dir, speed, ndx, ndy, tower;
      lastTime = this.lastTime || time;
      delta = time - lastTime;
      if (this.route && this.route.length) {
        nextNode = this.route[0];
        this.rage = false;
      } else {
        nextNode = {
          worldX: world.heart.x,
          worldY: world.heart.y
        };
        this.rage = true;
        if (Math.random() < 0.1) {
          this.reroute();
        }
      }
      if (nextNode) {
        dx = nextNode.worldX - this.x;
        dy = nextNode.worldY - this.y;
        dist2 = dx * dx + dy * dy;
        if (dist2 < 5 * 5) {
          this.route.shift();
        } else {
          dir = Math.atan2(dy, dx);
          speed = Math.min(Math.sqrt(dist2), this.actualSpeed) * (this.rage ? 3 : 1);
          ndx = Math.cos(dir) * speed;
          ndy = Math.sin(dir) * speed;
          this.dx = lerp(this.dx, ndx, 0.5);
          this.dy = lerp(this.dy, ndy, 0.5);
        }
      }
      this.x += this.dx;
      this.y += this.dy;
      this.updateGridCoordsFromXY();
      if (this.rage && (tower = world.checkGridObj(world.towers, this.gridX, this.gridY))) {
        tower.damage();
      }
      if (this.gridX == world.heart.gridX && this.gridY == world.heart.gridY) {
        this.dead = true;
        world.heart.damage();
        this.spawner.pool.push(this.attributes);
      }
      this.lastTime = time;
    };
    prototype.reroute = function(){
      var start, end, route, i$, len$, point;
      this.updateGridCoordsFromXY();
      start = makeAstarNode(this.gridX, this.gridY);
      end = makeAstarNode(world.heart.gridX, world.heart.gridY);
      route = aStar(start, end, bind$(world, 'getAstarNeighbors'));
      if (!route) {
        console.log("COULD NOT FIND ROUTE", start, end);
        this.route = null;
        return;
      }
      route.push(end);
      for (i$ = 0, len$ = route.length; i$ < len$; ++i$) {
        point = route[i$];
        point.worldX = point.x * 32 + irand(4, 32 - 4);
        point.worldY = point.y * 32 + irand(4, 32 - 4);
      }
      this.route = route;
    };
    prototype.damage = function(val){
      var n;
      if (this.health <= 0) {
        return;
      }
      this.health -= val;
      this.damageBlip = true;
      if (this.health <= 0) {
        n = 2 + 0 | Math.ceil(this.maxHealth / 75);
        world.credits += n;
        this.dead = true;
        return playSound("kill");
      } else {
        return playSound("ammo-hit");
      }
    };
    return Enemy;
  }(GridObject));
  Shot = (function(superclass){
    Shot.displayName = 'Shot';
    var prototype = extend$(Shot, superclass).prototype, constructor = Shot;
    function Shot(x, y, fillStyle, attributes, target){
      var r, range, bSpeed;
      this.x = x;
      this.y = y;
      this.fillStyle = fillStyle;
      this.attributes = attributes;
      this.target = target;
      r = Math.atan2(this.target.y - this.y, this.target.x - this.x);
      this.dx = Math.cos(r) * this.attributes.ammoSpeed;
      this.dy = Math.sin(r) * this.attributes.ammoSpeed;
      this.initialX = this.x;
      this.initialY = this.y;
      range = this.attributes.ammoRange;
      this.rangeSq = range * range;
      bSpeed = this.attributes.ammoSpeed * Math.max(1, Math.sqrt(this.attributes.ammoDamage * 0.25));
      this.size = Math.max(2, Math.min(7, bSpeed)) * 0.6;
      this.decel = lerp(1.0, 0.95, this.attributes.ammoDeceleration);
      this.life = 200;
    }
    prototype.step = function(){
      var dir, gridX, gridY, idx, idy, i$, ref$, len$, en, dx, dy, size, obj;
      this.x += this.dx;
      this.y += this.dy;
      this.dx *= this.decel;
      this.dy *= this.decel;
      if (this.attributes.homingAmmo && !this.target.dead) {
        dir = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        this.dx = lerp(Math.cos(dir) * this.attributes.ammoSpeed, this.dx, 0.2);
        this.dy = lerp(Math.sin(dir) * this.attributes.ammoSpeed, this.dy, 0.2);
      }
      if (!this.life-- || Math.abs(this.dx + this.dy) < 0.1) {
        this.dead = true;
      }
      gridX = 0 | this.x / 32;
      gridY = 0 | this.y / 32;
      idx = this.x - this.initialX;
      idy = this.y - this.initialY;
      if (idx * idx + idy * idy >= this.rangeSq) {
        this.dead = true;
      }
      for (i$ = 0, len$ = (ref$ = world.creeps).length; i$ < len$; ++i$) {
        en = ref$[i$];
        if (en.gridY != gridY) {
          continue;
        }
        dx = this.x - en.x;
        dy = this.y - en.y;
        size = Math.max(4, en.actualSize);
        if (dx * dx + dy * dy < size * size) {
          en.damage(this.attributes.ammoDamage);
          if (this.attributes.slowingAmmo) {
            en.actualSpeed *= 0.95;
          }
          this.dead = true;
          break;
        }
      }
      for (i$ = 0, len$ = (ref$ = world.objs).length; i$ < len$; ++i$) {
        obj = ref$[i$];
        if (obj.blocking) {
          if (gridX == obj.gridX && gridY == obj.gridY) {
            this.dead = true;
            break;
          }
        }
      }
    };
    prototype.draw = function(ctx){
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "white";
      ctx.fillStyle = this.fillStyle;
      ctx.save();
      ctx.rotate(time * this.attributes.ammoSpeed);
      ctx.rect(-this.size, -this.size, this.size * 2, this.size * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };
    return Shot;
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
      this.enemyMutationRate = 0.09;
      this.towerMutationRate = 0.04;
      this.heart = null;
      this.credits = 0;
      this.gameOver = false;
    }
    prototype.getAstarNeighbors = function(node){
      var neighbors, ndx, ndy, nx, ny;
      neighbors = [];
      for (ndx = -1; ndx <= +1; ++ndx) {
        for (ndy = -1; ndy <= +1; ++ndy) {
          if (ndx == 0 && ndy == 0) {
            continue;
          }
          nx = node.x + ndx;
          ny = node.y + ndy;
          if (this.isRoutable(nx, ny)) {
            neighbors.push(makeAstarNode(nx, ny));
          }
        }
      }
      return neighbors;
    };
    prototype.checkGridObj = function(arrGridObjs, gridX, gridY, blockingOnly){
      var i$, len$, obj;
      blockingOnly == null && (blockingOnly = false);
      for (i$ = 0, len$ = arrGridObjs.length; i$ < len$; ++i$) {
        obj = arrGridObjs[i$];
        if (blockingOnly && !obj.blocking) {
          continue;
        }
        if (obj.gridX == gridX && obj.gridY == gridY) {
          return obj;
        }
      }
      return false;
    };
    prototype.isRoutable = function(gridX, gridY){
      if (!validGridCoords(gridX, gridY)) {
        return false;
      }
      if (this.checkGridObj(this.towers, gridX, gridY)) {
        return false;
      }
      if (this.checkGridObj(this.objs, gridX, gridY, true)) {
        return false;
      }
      return true;
    };
    prototype.isPlaceable = function(gridX, gridY){
      if (!validGridCoords(gridX, gridY)) {
        return false;
      }
      if (this.checkGridObj(this.towers, gridX, gridY)) {
        return false;
      }
      if (this.checkGridObj(this.objs, gridX, gridY)) {
        return false;
      }
      return true;
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
      playSound("place");
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
        if (d.x < 0 || d.y < 0 || d.x > 800 || d.y > 544) {
          d.dead = true;
        }
        if (d.dead) {
          aDrawables.splice(i, 1);
          continue;
        }
        i += 1;
      }
      return aDrawables;
    };
    prototype.draw = function(ctx){
      var drawables, i$, len$, d, r, i, len1$, p, results$ = [];
      drawables = [].concat(this._process(this.creeps), this._process(this.towers), this._process(this.objs), this._process(this.ammo));
      if (this.heart.health <= 0) {
        this.gameOver = true;
      }
      drawables.sort(function(a, b){
        return a.y - b.y;
      });
      for (i$ = 0, len$ = drawables.length; i$ < len$; ++i$) {
        d = drawables[i$];
        ctx.translate(d.x, d.y);
        d.draw(ctx);
        ctx.translate(-d.x, -d.y);
        if (debug.routes) {
          r = d.route;
          ctx.lineWidth = 1;
          ctx.strokeStyle = "rgba(255,0,0,0.6)";
          if (r) {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            for (i = 0, len1$ = r.length; i < len1$; ++i) {
              p = r[i];
              ctx.lineTo(p.worldX, p.worldY);
            }
            results$.push(ctx.stroke());
          }
        }
      }
      return results$;
    };
    prototype.createBoulder = function(){
      var boulder, tries, x, y;
      boulder = new Boulder();
      for (tries = 0; tries < 30; ++tries) {
        x = irand(3, gridMaxX - 3);
        y = irand(0, gridMaxY - 1);
        if (this.isPlaceable(x, y)) {
          boulder.setGridCoords(x, y);
          this.objs.push(boulder);
          return boulder;
        }
      }
    };
    prototype.newGame = function(){
      var x, spawner, heart, i;
      this.credits = 15;
      for (x = 0; x < 7; ++x) {
        this.towerTray.push(new Tower(towerGenome.initialize()));
      }
      spawner = new Spawner();
      spawner.setGridCoords(0, 0 | Math.random() * gridMaxY - 1);
      this.objs.push(spawner);
      this.heart = heart = new Heart();
      heart.setGridCoords(gridMaxX - 1, 0 | Math.random() * gridMaxY - 1);
      this.objs.push(heart);
      for (i = 0; i < 10; ++i) {
        this.createBoulder();
      }
    };
    prototype.sellTower = function(tower){
      var i, ref$, len$, cTower;
      for (i = 0, len$ = (ref$ = this.towers).length; i < len$; ++i) {
        cTower = ref$[i];
        if (tower == cTower) {
          tower.onStage = false;
          this.towers.splice(i, 1);
          this.credits += 3;
          playSound("sell");
          break;
        }
      }
    };
    prototype.cloneTower = function(tower){
      var evTower;
      playSound("clone");
      evTower = new Tower(towerGenome.evolve(tower.attributes, tower.attributes, this.towerMutationRate));
      this.towerTray.push(evTower);
      evTower.generation = tower.generation;
      this.credits -= 10;
    };
    prototype.totalEnemiesLeft = function(){
      var n, i$, ref$, len$, obj;
      n = 0;
      for (i$ = 0, len$ = (ref$ = this.objs).length; i$ < len$; ++i$) {
        obj = ref$[i$];
        if (obj.enemiesLeft) {
          n += obj.enemiesLeft;
        }
      }
      return n;
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
  debug = {
    routes: false
  };
  towerGenome = new Genome({
    height: new FloatGene(),
    baseWidth: new FloatGene(),
    topWidth: new FloatGene(),
    form: new FloatGene(),
    range: new FloatGene(),
    hue: new FloatGene(),
    hueTop: new FloatGene(),
    ammoSpeed: new FloatGene(),
    ammoDamage: new FloatGene(),
    ammoRange: new FloatGene(),
    ammoDeceleration: new FloatGene(),
    shootSpeed: new FloatGene(),
    reloadAmmo: new FloatGene(),
    reloadSpeed: new FloatGene(),
    acquisitionSpeed: new FloatGene(),
    maxRange: new FloatGene(),
    slowingAmmo: new FloatGene(),
    homingAmmo: new FloatGene()
  });
  traitNames = {
    maxAmmo: "Ammo/reload",
    shotInterval: "Shot Speed",
    acqInterval: "Acquisition Speed",
    maxRange: "Acquisition Range",
    reloadTime: "Reload Time",
    ammoDamage: "Ammo Damage",
    ammoSpeed: "Ammo Speed",
    ammoRange: "Ammo Range",
    ammoDeceleration: "Ammo Deceleration",
    dps: "DPS"
  };
  enemyGenome = new Genome({
    speed: new FloatGene(),
    health: new FloatGene(),
    hue: new FloatGene(),
    size: new FloatGene(),
    flying: new FloatGene()
  });
  (function(document, window){
    var canvas, ctx, mouse, traySelected, worldSelected, tooltipText, inspectTower, setTooltip, drawGrid, drawScene, drawTray, drawInspect, draw, click, keyPress, step, newGame, init;
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
    inspectTower = null;
    setTooltip = function(it){
      tooltipText = it + "";
    };
    drawGrid = function(){
      var x, y;
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
      return ctx.stroke();
    };
    drawScene = function(){
      var p, worldSelectedChanged, canEvolve, cantEvolveReason, evolveTarget, i$, ref$, len$, tower, i, evTower;
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
      if (worldSelected && !worldSelected.onStage) {
        worldSelected = null;
      }
      worldSelectedChanged = false;
      canEvolve = true;
      if (world.towerTray.length >= 10) {
        canEvolve = false;
        cantEvolveReason = "Too many towers in tray";
      }
      if (world.credits < 5) {
        canEvolve = false;
        cantEvolveReason = "Not enough credits";
      }
      evolveTarget = null;
      if (!traySelected) {
        for (i$ = 0, len$ = (ref$ = world.towers).length; i$ < len$; ++i$) {
          tower = ref$[i$];
          if (worldSelected == tower || tower.gridX == mouse.gridX && tower.gridY == mouse.gridY) {
            inspectTower = tower;
            if (worldSelected && worldSelected != tower) {
              if (canEvolve) {
                evolveTarget = tower;
                ctx.strokeStyle = "magenta";
                setTooltip("Evolve towers (5 CR)");
                ctx.lineWidth = 1;
                ctx.beginPath();
                for (i = 0; i < 3; ++i) {
                  ctx.moveTo(tower.x + rand(-5, 5), tower.y + rand(-5, 5));
                  ctx.lineTo(worldSelected.x + rand(-5, 5), worldSelected.y + rand(-5, 5));
                }
                ctx.stroke();
              } else {
                ctx.strokeStyle = "red";
                setTooltip("Can't evolve: " + cantEvolveReason);
              }
            }
            ctx.beginPath();
            ctx.strokeStyle = worldSelected == tower ? "magenta" : "purple";
            ctx.lineWidth = 4;
            ctx.rect(tower.gridX * 32, tower.gridY * 32, 32, 32);
            ctx.stroke();
            if (mouse.b) {
              if (canEvolve && worldSelected && worldSelected != tower) {
                playSound("evolve");
                evTower = new Tower(towerGenome.evolve(worldSelected.attributes, tower.attributes, world.towerMutationRate));
                evTower.generation = Math.max(worldSelected.generation, tower.generation) + 1;
                world.credits -= 5;
                world.towerTray.push(evTower);
                worldSelected = null;
                traySelected = evTower;
              } else {
                worldSelected = tower;
                worldSelectedChanged = true;
              }
            }
          }
        }
      }
      if (evolveTarget) {
        inspectTower = evolveTarget;
      }
      if (worldSelected) {
        ctx.strokeStyle = "silver";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(worldSelected.x, worldSelected.y, worldSelected.actual.maxRange, 0, 6.282);
        ctx.stroke();
        ctx.strokeStyle = "gray";
        ctx.beginPath();
        ctx.arc(worldSelected.x, worldSelected.y, worldSelected.actual.ammoRange, 0, 6.282);
        ctx.stroke();
      }
      return world.draw(ctx);
    };
    drawTray = function(){
      var enemiesLeft, i, ref$, len$, tower, tx;
      ctx.strokeStyle = "cyan";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 544);
      ctx.lineTo(800, 544);
      ctx.moveTo(800, 0);
      ctx.lineTo(800, 600);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = "silver";
      ctx.font = "14px " + fontStack;
      enemiesLeft = world.totalEnemiesLeft();
      if (world.gameOver) {
        ctx.fillStyle = "red";
        ctx.fillText("GAME OVER.", 820, 530);
      } else if (enemiesLeft <= 0) {
        ctx.fillStyle = "lime";
        ctx.fillText("YOU WIN!", 820, 530);
      }
      ctx.fillText("Credits: " + world.credits, 820, 550);
      ctx.fillText("Core Health: " + world.heart.health, 820, 570);
      ctx.fillText("Enemies Left: " + enemiesLeft, 820, 590);
      if (world.towerTray.length == 0) {
        ctx.fillText("Click on two towers to evolve them!", 16, 570);
      }
      if (world.towers.length == 0) {
        ctx.fillStyle = (time * 4) % 1 < 0.5 ? "silver" : "white";
        ctx.fillText("Click on a tower below to place it.", 16, 530);
      }
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
          inspectTower = tower;
        }
        tower.draw(ctx);
        ctx.restore();
      }
    };
    drawInspect = function(){
      var y, lines, key, ref$, val, txval, i$, len$, text;
      ctx.font = "14px " + fontStack;
      ctx.beginPath();
      ctx.fillStyle = "white";
      y = 20;
      lines = [];
      lines.push("Generation " + inspectTower.generation);
      for (key in ref$ = inspectTower.actual) {
        val = ref$[key];
        if (key = traitNames[key]) {
          txval = val == (0 | val)
            ? val + ""
            : val.toFixed(2);
          lines.push(key + ": " + txval);
        }
      }
      lines.push("");
      if (inspectTower.actual.maxAmmo < 10) {
        lines.push("Low ammo");
      }
      if (inspectTower.actual.reloadTime > 5) {
        lines.push("Slow reload");
      }
      if (inspectTower.actual.maxRange < 50) {
        lines.push("Low range of acquisition");
      }
      if (inspectTower.actual.acqInterval > 3) {
        lines.push("Slow acquisition");
      }
      if (inspectTower.actual.ammoRange < 120) {
        lines.push("Low-range ammo");
      }
      if (inspectTower.actual.ammoDamage < 12) {
        lines.push("Low damage ammo");
      }
      if (inspectTower.actual.shotInterval < 0.1) {
        lines.push("Rapid fire");
      }
      if (inspectTower.actual.ammoSpeed > 12) {
        lines.push("Fast ammo");
      }
      if (inspectTower.actual.ammoDamage > 30) {
        lines.push("High ammo damage");
      }
      if (inspectTower.actual.maxRange > 150) {
        lines.push("Long range of acquisition");
      }
      if (inspectTower.actual.ammoRange > 250) {
        lines.push("Long-range ammo");
      }
      if (inspectTower.actual.acqInterval < 2) {
        lines.push("Fast acquisition");
      }
      if (inspectTower.actual.reloadTime < 2) {
        lines.push("Fast reload");
      }
      if (inspectTower.actual.slowingAmmo) {
        lines.push("Ammo slows enemies");
      }
      if (inspectTower.actual.homingAmmo) {
        lines.push("Ammo homes on enemies");
      }
      if (inspectTower.onStage) {
        lines.push("");
        lines.push("[S] Sell tower (+3 CR)");
        if (world.credits >= 10) {
          lines.push("[C] Clone tower (-10 CR)");
        }
      }
      for (i$ = 0, len$ = lines.length; i$ < len$; ++i$) {
        text = lines[i$];
        ctx.fillText(text, 815, y);
        y += 20;
      }
    };
    draw = function(){
      var w, ttX, ttY;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, 1024, 600);
      tooltipText = null;
      inspectTower = null;
      drawScene();
      ctx.fillStyle = "#000";
      ctx.fillRect(800, 0, 1024 - 800, 600);
      drawTray();
      if (inspectTower) {
        drawInspect();
      }
      if (tooltipText) {
        ctx.font = "12px " + fontStack;
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
    keyPress = function(keyCode){
      if (keyCode == 115 && inspectTower && inspectTower.onStage) {
        world.sellTower(inspectTower);
      }
      if (keyCode == 99 && inspectTower && world.credits >= 10 && world.towerTray.length < 10) {
        return world.cloneTower(inspectTower);
      }
    };
    step = function(){
      time += 1 / 22.0;
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
        into.x = event.offsetX || event.clientX;
        into.y = event.offsetY || event.clientY;
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
      }, false);
      canvas.addEventListener("mouseup", function(event){
        mouse.b = false;
        handleMove(mouse, event);
      }, false);
      canvas.addEventListener("mousemove", function(event){
        handleMove(mouse, event);
      }, false);
      canvas.addEventListener("click", function(event){
        handleMove(mouse, event);
        click();
      }, false);
      document.addEventListener("keypress", function(event){
        keyPress(event.keyCode || event.charCode);
      }, false);
      loadSound("core-hit", "core-hit2.wav");
      loadSound("ammo-hit", "ammo-hit.wav");
      loadSound("kill", "kill.wav");
      loadSound("tower-hurt", "tower-hurt.wav");
      loadSound("place", "place.wav");
      loadSound("shoot", "shoot.wav");
      loadSound("evolve", "evolve.wav");
      loadSound("clone", "clone.wav");
      loadSound("sell", "sell.wav");
      newGame();
      return setInterval(step, 1000 / 22.0);
    };
    window.EvoTD = {
      init: init,
      debug: debug,
      newGame: newGame,
      getWorld: function(){
        return world;
      },
      setSounds: function(it){
        return enableSound = !!it;
      }
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
