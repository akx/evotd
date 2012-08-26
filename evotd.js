(function(){
  var Gene, toBits, fromBits, EightBitGene, Genome, Tower, towerGenome, canvas, ctx, mouse, towers, creeps, ammo, towerTray, time, drawScene, draw, step, newGame, init;
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
  EightBitGene = (function(superclass){
    EightBitGene.displayName = 'EightBitGene';
    var prototype = extend$(EightBitGene, superclass).prototype, constructor = EightBitGene;
    prototype.initialize = function(){
      return 0 | Math.random() * 256;
    };
    prototype.evolve = function(a, b, mutation){
      var aBits, bBits, res$, i, v, cBits;
      mutation == null && (mutation = 0);
      aBits = eightBits(a);
      bBits = eightBits(b);
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
      return fromBits(cBits);
    };
    function EightBitGene(){}
    return EightBitGene;
  }(Gene));
  Genome = (function(){
    Genome.displayName = 'Genome';
    var prototype = Genome.prototype, constructor = Genome;
    function Genome(genes){
      this.genes = genes;
    }
    prototype.initialize = function(){
      var obj, attr, ref$, name;
      obj = {};
      for (attr in ref$ = this.genes) {
        name = ref$[attr];
        obj[name] = attr.initialize();
      }
      return obj;
    };
    return Genome;
  }());
  Tower = (function(){
    Tower.displayName = 'Tower';
    var prototype = Tower.prototype, constructor = Tower;
    function Tower(gridX, gridY, attributes){
      this.gridX = gridX;
      this.gridY = gridY;
      this.attributes = attributes;
    }
    prototype.draw = function(ctx){
      var hue, pxHeight, i, sz;
      hue = 0 | (this.attributes.hue / 256.0) * 360;
      ctx.fillStyle = "hsv(" + hue + ",100%,100%)";
      pxHeight = 8 + this.attributes.height / 256.0 * 32;
      ctx.beginPath();
      for (i = 0; i < pxHeight; i += 2) {
        sz = 30 * (i / pxHeight);
        ctx.arc(0, 0, sz, 0, 6.282);
      }
      return ctx.fill();
    };
    return Tower;
  }());
  towerGenome = new Genome({
    height: new EightBitGene(),
    form: new EightBitGene(),
    range: new EightBitGene(),
    hue: new EightBitGene(),
    ammoSpeed: new EightBitGene(),
    reloadSpeed: new EightBitGene(),
    acquisitionSpeed: new EightBitGene()
  });
  canvas = null;
  ctx = null;
  mouse = {
    b: false,
    x: 0,
    y: 0,
    downX: 0,
    downY: 0
  };
  towers = [];
  creeps = [];
  ammo = [];
  towerTray = [];
  time = 0;
  drawScene = function(){
    var drawables, i$, len$, d, results$ = [];
    drawables = [].concat(towers, creeps, ammo);
    drawables.sort(function(a, b){
      return b.y - a.y;
    });
    for (i$ = 0, len$ = drawables.length; i$ < len$; ++i$) {
      d = drawables[i$];
      ctx.translate(d.x, d.y);
      d.draw(ctx);
      results$.push(ctx.translate(-d.x, -d.y));
    }
    return results$;
  };
  draw = function(){
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 800, 600);
    return drawScene();
  };
  step = function(){
    time += 1 / 30.0;
    return draw();
  };
  newGame = function(){
    towers = [];
    creeps = [];
    ammo = [];
    towerTray = [];
    return time = 0;
  };
  init = function(){
    var $;
    $ = function(it){
      return document.getElementById(it);
    };
    canvas = $("canvas");
    ctx = canvas.getContext("2d");
    canvas.addEventListener("mousedown", function(event){
      mouse.b = true;
      mouse.x = mouse.downX = event.offsetX;
      mouse.y = mouse.downY = event.offsetY;
    });
    canvas.addEventListener("mouseup", function(event){
      mouse.b = false;
      mouse.x = event.offsetX;
      mouse.y = event.offsetY;
    });
    canvas.addEventListener("mousemove", function(event){
      mouse.x = event.offsetX;
      mouse.y = event.offsetY;
    });
    return setInterval(step, 1000 / 30.0);
  };
  (window || this).EvoTD = {
    init: init
  };
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
}).call(this);
