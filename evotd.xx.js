(function() {
    function H(e, t) {
        function n() {}
        n.prototype = (e.superclass = t).prototype;
        (e.prototype = new n).constructor = e;
        typeof t.extended == "function" && t.extended(e);
        return e;
    }
    function B(e, t) {
        return function() {
            return e[t].apply(e, arguments);
        };
    }
    var e, t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N, C, k, L, A, O, M, _, D, P;
    e = function(e, t) {
        var n, r = [];
        t == null && (t = 8);
        for (n = 0; n < t; ++n) r.push(!!(e & 1 << n));
        return r;
    };
    t = function(e) {
        var t, n, r, i;
        t = 0;
        for (n = 0, r = e.length; n < r; ++n) {
            i = e[n];
            i && (t |= 1 << n);
        }
        return t;
    };
    n = function(e, t, n) {
        return t * n + e * (1 - n);
    };
    r = function(e, t) {
        return (e + Math.random() * (t - e)) * (Math.random() < .5 ? -1 : 1);
    };
    i = function(e, t) {
        return e + Math.random() * (t - e);
    };
    s = function(e, t) {
        return 0 | e + Math.random() * (t - e);
    };
    o = function(e) {
        return e[s(0, e.length)];
    };
    u = function(e, t, n) {
        var r, i;
        r = e.x - t.x;
        i = e.y - t.y;
        return r * r + i * i < n * n;
    };
    a = function(e, t, n) {
        var r, i, s, o, u, a, f, l = [];
        r = Math.cos(t * n.wd);
        i = Math.sin(t * n.zd);
        s = n.R - n.r;
        for (o = 0; o < 25; o += .1) {
            u = s / n.r * o;
            a = s * Math.cos(o) + n.d * Math.cos(r + u);
            f = s * Math.sin(o) - n.d * Math.sin(i - u);
            o == 0 ? l.push(e.moveTo(a, f)) : l.push(e.lineTo(a, f));
        }
        return l;
    };
    f = function() {
        return {
            R: 15 + Math.random() * 15,
            r: 5 + Math.random() * 10,
            d: Math.random() * 5,
            wd: r(1.1, 1.4),
            zd: r(1.1, 1.4)
        };
    };
    l = "Corbel, Segoe UI, Frutiger Linotype, sans-serif";
    c = function(e, t) {
        return {
            x: e,
            y: t,
            id: e + "," + t
        };
    };
    h = function(e, t, n) {
        function S(e, t) {
            return a[e.id] - a[t.id];
        }
        var r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E;
        r = {};
        i = [];
        s = {};
        o = {};
        u = {};
        a = {};
        f = function(e, t) {
            return Math.abs(e.x - t.x) + Math.abs(e.y - t.y);
        };
        l = function(e, t) {
            var n, r;
            n = e.x - t.x;
            r = e.y - t.y;
            return Math.sqrt(n * n + r * r);
        };
        c = function(e, t) {
            i.push(e);
            s[e.id] = 1;
            u[e.id] = t;
        };
        h = function(e) {
            a[e.id] = u[e.id] + f(e, t);
        };
        p = function() {
            var e, n, r;
            e = t;
            n = [];
            while (r = o[e.id]) {
                n.unshift(r);
                e = r;
            }
            return n;
        };
        c(e, 0);
        h(e);
        while (i.length) {
            i = i.sort(S);
            d = i.shift();
            v = d.id;
            delete s[v];
            if (v == t.id) return p();
            r[v] = 1;
            for (m = 0, y = (g = n(d)).length; m < y; ++m) {
                b = g[m];
                w = b.id;
                if (r[w]) continue;
                E = u[v] + l(d, b);
                if (!s[w] || E < u[w]) {
                    c(b, E);
                    o[w] = d;
                    a[w] = u[w] + f(b, t);
                }
            }
        }
        return null;
    };
    p = function() {
        var e, t;
        e = {};
        t = !0;
        return {
            setEnabled: function(e) {
                t = !!e;
            },
            load: function(t, n) {
                var r;
                r = new Audio;
                r.setAttribute("src", n);
                r.load();
                e[t] = r;
            },
            play: function(n) {
                var r;
                if (!t) return;
                (r = e[n]) != null && r.play();
            }
        };
    }.call(this);
    d = function() {
        function n() {}
        n.displayName = "Gene";
        var e = n.prototype, t = n;
        e.initialize = function() {};
        e.evolve = function(e, t, n) {
            n == null && (n = 0);
        };
        return n;
    }();
    v = function(e) {
        function i() {}
        i.displayName = "EightBitGene";
        var n = H(i, e).prototype, r = i;
        n.initialize = function() {
            return Math.random();
        };
        n.evolve = function(e, n, r) {
            var i, s, o, u, a, f;
            r == null && (r = 0);
            i = eightBits(e * 255);
            s = eightBits(n * 255);
            o = [];
            for (u = 0; u < 8; ++u) {
                a = Math.random() < .5;
                Math.random() < r ? o.push(a) : a ? o.push(i[u]) : o.push(s[u]);
            }
            f = o;
            return t(f) / 256;
        };
        return i;
    }(d);
    m = function(e) {
        function s() {}
        s.displayName = "FloatGene";
        var t = H(s, e).prototype, r = s;
        t.initialize = function() {
            return Math.random();
        };
        t.evolve = function(e, t, r) {
            r == null && (r = 0);
            return Math.random() < r ? this.initialize() : n(e, t, i(.3, .7));
        };
        return s;
    }(d);
    g = function() {
        function n(e) {
            this.genes = e;
        }
        n.displayName = "Genome";
        var e = n.prototype, t = n;
        e.initialize = function() {
            var e, t, n, r;
            e = {};
            for (t in n = this.genes) {
                r = n[t];
                e[t] = r.initialize();
            }
            return e;
        };
        e.evolve = function(e, t, n) {
            var r, i, s, o, u, a, f;
            n == null && (n = 0);
            e = e.attributes || e;
            t = t.attributes || t;
            r = {};
            for (i in s = this.genes) {
                o = s[i];
                u = e[i];
                a = t[i];
                u !== undefined && a !== undefined ? f = o.evolve(u, a, n) : f = o.initialize();
                r[i] = f;
            }
            return r;
        };
        return n;
    }();
    y = function() {
        function n() {
            this.gridX = this.gridY = this.x = this.y = 0;
        }
        n.displayName = "GridObject";
        var e = n.prototype, t = n;
        e.setGridCoords = function(e, t) {
            this.x = (this.gridX = 0 | e) * 32 + 16;
            this.y = (this.gridY = 0 | t) * 32 + 16;
        };
        e.updateGridCoordsFromXY = function() {
            this.gridX = 0 | this.x / 32;
            this.gridY = 0 | this.y / 32;
        };
        return n;
    }();
    b = function(e) {
        function i(t) {
            var r;
            this.attributes = t;
            e.call(this);
            this.nextReload = 0;
            this.nextShot = 0;
            this.nextAcquisition = 0;
            this.health = this.maxHealth = 5;
            this.damageBlip = !1;
            this.generation = 0;
            this.actual = {
                maxAmmo: 0 | n(1, 50, this.attributes.reloadAmmo),
                shotInterval: 1 / n(3, 20, this.attributes.shootSpeed),
                acqInterval: n(4, .3, this.attributes.acquisitionSpeed),
                maxRange: 0 | n(48, 200, this.attributes.maxRange),
                reloadTime: n(1, 5, this.attributes.reloadSpeed),
                ammoDamage: n(1, 35, this.attributes.ammoDamage),
                ammoSpeed: n(3, 20, this.attributes.ammoSpeed),
                ammoRange: n(80, 400, this.attributes.ammoRange),
                ammoDeceleration: this.attributes.ammoDeceleration,
                slowingAmmo: this.attributes.slowingAmmo > .75,
                homingAmmo: this.attributes.homingAmmo > .85
            };
            this.actual.dps = this.actual.ammoDamage / (1 / this.actual.shotInterval);
            this.depletionTime = this.actual.maxAmmo * this.actual.shotInterval + .1;
            this.reload();
            r = 0 | this.attributes.hue * 360;
            this.fillStyle = "hsl(" + r + ",100%,50%)";
        }
        i.displayName = "Tower";
        var t = H(i, e).prototype, r = i;
        t.reload = function() {
            this.ammo = this.actual.maxAmmo;
            this.nextShot = 0;
            this.nextReload = 0;
            this.reloading = !1;
        };
        t.beginReload = function() {
            this.reloading = !0;
            this.nextReload = O + this.depletionTime + this.actual.reloadTime;
        };
        t.reacquire = function() {
            var e, t, n, r, i, s, o, u, a, f;
            this.unacquire();
            e = null;
            t = 0;
            n = this.actual.maxRange * this.actual.maxRange;
            for (r = 0, s = (i = A.creeps).length; r < s; ++r) {
                o = i[r];
                u = this.x - o.x;
                a = this.y - o.y;
                f = u * u + a * a;
                if ((!e || f < t) && f < n) {
                    t = f;
                    e = o;
                }
            }
            this.acquiredEnemy = e;
            this.nextShot = O + this.actual.shotInterval;
        };
        t.unacquire = function() {
            this.acquiredEnemy = null;
            this.nextAcquisition = O + this.actual.acqInterval;
        };
        t.step = function() {
            this.onStage = !0;
            O >= this.nextAcquisition && this.reacquire();
            this.ammo <= 0 && (this.nextReload <= 0 ? this.beginReload() : O >= this.nextReload && this.reload());
            if (this.acquiredEnemy) if (!u(this, this.acquiredEnemy, this.actual.maxRange)) this.unacquire(); else if (this.ammo > 0 && O >= this.nextShot) {
                this.nextShot = O + this.actual.shotInterval;
                if (this.acquiredEnemy.dead) this.acquiredEnemy = null; else {
                    this.shoot(this.acquiredEnemy);
                    this.ammo--;
                }
            }
        };
        t.shoot = function(e) {
            var t;
            t = new T(this.x, this.y, this.fillStyle, this.actual, e);
            A.ammo.push(t);
            p.play("shoot");
        };
        t.draw = function(e) {
            var t, r, i, s, o, u, a, f;
            t = 8 + this.attributes.height * 48;
            r = 3 + this.attributes.baseWidth * 27;
            i = 3 + this.attributes.topWidth * 17;
            e.font = "12px " + l;
            e.strokeStyle = "transparent";
            for (s = 0; s < t; s += 3) {
                o = 1 - s / t;
                o = Math.pow(o, this.attributes.form * 2);
                u = n(i, r, o);
                a = n(this.attributes.hue * 360, this.attributes.hueTop * 360, o);
                e.fillStyle = this.damageBlip ? "white" : "hsl(" + a + ", 100%, 50%)";
                e.beginPath();
                e.arc(0, -s, u / 2, 0, 6.282);
                e.fill();
            }
            this.damageBlip = !1;
            if (this.onStage) {
                if (this.ammo > 0) {
                    e.beginPath();
                    f = n(0, 32, this.ammo / this.actual.maxAmmo);
                    e.rect(-16, 14, f, 2);
                    e.fill();
                }
                e.fillStyle = "white";
                if (this.reloading && O * 2 & 1) {
                    e.beginPath();
                    e.fillText("R", -2, 0);
                }
                if (!this.reloading && !this.acquiredEnemy) {
                    e.beginPath();
                    e.fillText("?", -2, 0);
                }
            }
        };
        t.damage = function() {
            this.health--;
            this.damageBlip = !0;
            p.play("tower-hurt");
            this.health <= 0 && (this.dead = !0);
        };
        return i;
    }(y);
    w = function(e) {
        function s() {
            e.call(this);
            this.ljParams = f();
            this.figureOutNextSpawn(5);
            this.pool = [ P.initialize(), P.initialize(), P.initialize(), P.initialize(), P.initialize() ];
            this.enemiesLeft = this.enemiesTotal = 300;
            this.enemiesSpawned = 0;
        }
        s.displayName = "Spawner";
        var t = H(s, e).prototype, r = s;
        t.figureOutNextSpawn = function(e) {
            var t;
            e == null && (e = 1);
            t = i(.75, 4) * e;
            this.nextSpawn = O + t;
        };
        t.draw = function(e) {
            var t;
            e.save();
            e.rotate(O);
            e.beginPath();
            e.strokeStyle = "red";
            e.lineWidth = 1;
            a(e, O, this.ljParams);
            e.stroke();
            e.restore();
            if (this.nextSpawn > 0) {
                t = Math.min(1, (this.nextSpawn - O) / 5);
                e.strokeStyle = "white";
                e.beginPath();
                e.lineWidth = 1;
                e.arc(0, 0, 8 + Math.cos(O) * 4, 0, n(0, 6.282, t));
                e.stroke();
            }
        };
        t.step = function() {
            if (!A.gameOver && this.enemiesLeft && this.nextSpawn && O >= this.nextSpawn) {
                this.figureOutNextSpawn();
                this.spawn();
            }
        };
        t.spawn = function() {
            var e, t, n;
            this.enemiesLeft--;
            this.enemiesSpawned++;
            e = [].concat(this.pool).concat(A.creeps);
            e.length && Math.random() > .95 ? t = P.evolve(o(e), o(e), A.enemyMutationRate) : t = P.initialize();
            n = new x(t);
            n.spawner = this;
            n.setGridCoords(this.gridX, this.gridY);
            n.reroute();
            A.creeps.push(n);
        };
        return s;
    }(y);
    E = function(e) {
        function i() {
            e.call(this);
            this.ljParams = f();
            this.health = this.maxHealth = 50;
            this.damageBlip = 0;
        }
        i.displayName = "Heart";
        var t = H(i, e).prototype, r = i;
        t.damage = function() {
            this.health--;
            this.damageBlip = 15;
            p.play("core-hit");
        };
        t.draw = function(e) {
            e.strokeStyle = "lime";
            this.life < this.maxLife * .5 && O * 3 % 1 < .5 && (e.strokeStyle = "orange");
            if (this.damageBlip > 0) {
                this.damageBlip--;
                O * 5 % 1 < .5 && (e.strokeStyle = "white");
            }
            e.save();
            e.rotate(-O);
            e.beginPath();
            e.lineWidth = 1;
            a(e, O, this.ljParams);
            e.stroke();
            e.restore();
            if (this.life < this.maxLife) {
                e.strokeStyle = "white";
                e.save();
                e.rotate(O * 3);
                e.beginPath();
                e.lineWidth = 1;
                e.arc(0, 0, 8 + Math.cos(O) * 2, 0, n(0, 6.282, this.life / this.maxLife));
                e.stroke();
                e.restore();
            }
        };
        return i;
    }(y);
    S = function(e) {
        function r() {
            e.call(this);
            this.blocking = !0;
        }
        r.displayName = "Boulder";
        var t = H(r, e).prototype, n = r;
        t.draw = function(e) {
            e.beginPath();
            e.fillStyle = "#444";
            e.strokeStyle = "silver";
            e.lineWidth = 2;
            e.rect(-12, -12, 24, 24);
            e.fill();
            e.stroke();
            e.beginPath();
            e.fillStyle = "#666";
            e.rect(-12, -24, 24, 24);
            e.fill();
            e.stroke();
        };
        return r;
    }(y);
    x = function(e) {
        function i(t) {
            this.attributes = t;
            e.call(this);
            this.route = null;
            this.actualSpeed = n(2, 12, this.attributes.speed) * Math.sqrt(this.attributes.health);
            this.actualSize = n(6, 32, this.attributes.size) / 2;
            this.maxHealth = this.health = 0 | n(30, 500, this.attributes.health);
            this.dx = this.dy = 0;
        }
        i.displayName = "Enemy";
        var t = H(i, e).prototype, r = i;
        t.draw = function(e) {
            var t, r, i, s;
            t = 0 | this.attributes.hue * 360;
            r = (this.attributes.hue - .5) * O * (1 + this.attributes.speed) * 10;
            i = "hsl(" + t + ", 30%, 50%)";
            e.beginPath();
            if (this.damageBlip) {
                i = "white";
                this.damageBlip = !1;
            }
            e.fillStyle = e.strokeStyle = i;
            e.lineWidth = this.rage && O * 3 % 1 < .5 ? 6 : 2;
            e.arc(0, 0, this.actualSize, r, r + 4.7);
            e.stroke();
            if (this.health > 0 && this.health < this.maxHealth) {
                e.beginPath();
                s = n(0, 32, this.health / this.maxHealth);
                e.rect(-16, 14, s, 2);
                e.fill();
            }
        };
        t.step = function() {
            var e, t, r, i, s, o, u, a, f, l, c;
            e = this.lastTime || O;
            t = O - e;
            if (this.route && this.route.length) {
                r = this.route[0];
                this.rage = !1;
            } else {
                r = {
                    worldX: A.heart.x,
                    worldY: A.heart.y
                };
                this.rage = !0;
                Math.random() < .1 && this.reroute();
            }
            if (r) {
                i = r.worldX - this.x;
                s = r.worldY - this.y;
                o = i * i + s * s;
                if (o < 25) this.route.shift(); else {
                    u = Math.atan2(s, i);
                    a = Math.min(Math.sqrt(o), this.actualSpeed) * (this.rage ? 3 : 1);
                    f = Math.cos(u) * a;
                    l = Math.sin(u) * a;
                    this.dx = n(this.dx, f, .5);
                    this.dy = n(this.dy, l, .5);
                }
            }
            this.x += this.dx;
            this.y += this.dy;
            this.updateGridCoordsFromXY();
            this.rage && (c = A.checkGridObj(A.towers, this.gridX, this.gridY)) && c.damage();
            if (this.gridX == A.heart.gridX && this.gridY == A.heart.gridY) {
                this.dead = !0;
                A.heart.damage();
                this.spawner.pool.push(this.attributes);
            }
            this.lastTime = O;
        };
        t.reroute = function() {
            var e, t, n, r, i, o;
            this.updateGridCoordsFromXY();
            e = c(this.gridX, this.gridY);
            t = c(A.heart.gridX, A.heart.gridY);
            n = h(e, t, B(A, "getAstarNeighbors"));
            if (!n) {
                console.log("COULD NOT FIND ROUTE", e, t);
                this.route = null;
                return;
            }
            n.push(t);
            for (r = 0, i = n.length; r < i; ++r) {
                o = n[r];
                o.worldX = o.x * 32 + s(4, 28);
                o.worldY = o.y * 32 + s(4, 28);
            }
            this.route = n;
        };
        t.damage = function(e) {
            var t;
            if (this.health <= 0) return;
            this.health -= e;
            this.damageBlip = !0;
            if (this.health <= 0) {
                t = 2 | Math.ceil(this.maxHealth / 75);
                A.credits += t;
                this.dead = !0;
                p.play("kill");
            } else p.play("ammo-hit");
        };
        return i;
    }(y);
    T = function(e) {
        function i(e, t, r, i, s) {
            var o, u, a;
            this.x = e;
            this.y = t;
            this.fillStyle = r;
            this.attributes = i;
            this.target = s;
            o = Math.atan2(this.target.y - this.y, this.target.x - this.x);
            this.dx = Math.cos(o) * this.attributes.ammoSpeed;
            this.dy = Math.sin(o) * this.attributes.ammoSpeed;
            this.initialX = this.x;
            this.initialY = this.y;
            u = this.attributes.ammoRange;
            this.rangeSq = u * u;
            a = this.attributes.ammoSpeed * Math.max(1, Math.sqrt(this.attributes.ammoDamage * .25));
            this.size = Math.max(2, Math.min(7, a)) * .6;
            this.decel = n(1, .95, this.attributes.ammoDeceleration);
            this.life = 200;
        }
        i.displayName = "Shot";
        var t = H(i, e).prototype, r = i;
        t.step = function() {
            var e, t, r, i, s, o, u, a, f, l, c, h, p;
            this.x += this.dx;
            this.y += this.dy;
            this.dx *= this.decel;
            this.dy *= this.decel;
            if (this.attributes.homingAmmo && !this.target.dead) {
                e = Math.atan2(this.target.y - this.y, this.target.x - this.x);
                this.dx = n(Math.cos(e) * this.attributes.ammoSpeed, this.dx, .2);
                this.dy = n(Math.sin(e) * this.attributes.ammoSpeed, this.dy, .2);
            }
            if (!(this.life--) || Math.abs(this.dx + this.dy) < .1) this.dead = !0;
            t = 0 | this.x / 32;
            r = 0 | this.y / 32;
            i = this.x - this.initialX;
            s = this.y - this.initialY;
            i * i + s * s >= this.rangeSq && (this.dead = !0);
            for (o = 0, a = (u = A.creeps).length; o < a; ++o) {
                f = u[o];
                if (f.gridY != r) continue;
                l = this.x - f.x;
                c = this.y - f.y;
                h = Math.max(4, f.actualSize);
                if (l * l + c * c < h * h) {
                    f.damage(this.attributes.ammoDamage);
                    this.attributes.slowingAmmo && (f.actualSpeed *= .95);
                    this.dead = !0;
                    break;
                }
            }
            for (o = 0, a = (u = A.objs).length; o < a; ++o) {
                p = u[o];
                if (p.blocking && t == p.gridX && r == p.gridY) {
                    this.dead = !0;
                    break;
                }
            }
        };
        t.draw = function(e) {
            e.beginPath();
            e.lineWidth = 1;
            e.strokeStyle = "white";
            e.fillStyle = this.fillStyle;
            e.save();
            e.rotate(O * this.attributes.ammoSpeed);
            e.rect(-this.size, -this.size, this.size * 2, this.size * 2);
            e.fill();
            e.stroke();
            e.restore();
        };
        return i;
    }(y);
    N = function() {
        function n() {
            this.towers = [];
            this.creeps = [];
            this.ammo = [];
            this.towerTray = [];
            this.objs = [];
            this.enemyMutationRate = .09;
            this.towerMutationRate = .04;
            this.heart = null;
            this.credits = 0;
            this.gameOver = !1;
        }
        n.displayName = "World";
        var e = n.prototype, t = n;
        e.getAstarNeighbors = function(e) {
            var t, n, r, i, s;
            t = [];
            for (n = -1; n <= 1; ++n) for (r = -1; r <= 1; ++r) {
                if (n == 0 && r == 0) continue;
                i = e.x + n;
                s = e.y + r;
                this.isRoutable(i, s) && t.push(c(i, s));
            }
            return t;
        };
        e.checkGridObj = function(e, t, n, r) {
            var i, s, o;
            r == null && (r = !1);
            for (i = 0, s = e.length; i < s; ++i) {
                o = e[i];
                if (r && !o.blocking) continue;
                if (o.gridX == t && o.gridY == n) return o;
            }
            return !1;
        };
        e.isRoutable = function(e, t) {
            return C(e, t) ? this.checkGridObj(this.towers, e, t) ? !1 : this.checkGridObj(this.objs, e, t, !0) ? !1 : !0 : !1;
        };
        e.isPlaceable = function(e, t) {
            return C(e, t) ? this.checkGridObj(this.towers, e, t) ? !1 : this.checkGridObj(this.objs, e, t) ? !1 : !0 : !1;
        };
        e.placeTower = function(e, t, n) {
            var r, i, s, o, u, a;
            for (r = 0, i = this.towerTray.length; r < i; ++r) if (this.towerTray[r] == e) {
                this.towerTray.splice(r, 1);
                break;
            }
            e.setGridCoords(t, n);
            this.towers.push(e);
            p.play("place");
            for (s = 0, u = (o = this.creeps).length; s < u; ++s) {
                a = o[s];
                a.reroute();
            }
        };
        e._process = function(e) {
            var t, n;
            t = 0;
            while (t < e.length) {
                n = e[t];
                typeof n.step == "function" && n.step();
                if (n.x < 0 || n.y < 0 || n.x > 800 || n.y > 544) n.dead = !0;
                if (n.dead) {
                    e.splice(t, 1);
                    continue;
                }
                t += 1;
            }
            return e;
        };
        e.draw = function(e) {
            var t, n, r, i, s, o, u, a;
            t = [].concat(this._process(this.creeps), this._process(this.towers), this._process(this.objs), this._process(this.ammo));
            this.heart.health <= 0 && (this.gameOver = !0);
            t.sort(function(e, t) {
                return e.y - t.y;
            });
            for (n = 0, r = t.length; n < r; ++n) {
                i = t[n];
                e.translate(i.x, i.y);
                i.draw(e);
                e.translate(-i.x, -i.y);
                if (M.routes) {
                    s = i.route;
                    e.lineWidth = 1;
                    e.strokeStyle = "rgba(255,0,0,0.6)";
                    if (s) {
                        e.beginPath();
                        e.moveTo(i.x, i.y);
                        for (o = 0, u = s.length; o < u; ++o) {
                            a = s[o];
                            e.lineTo(a.worldX, a.worldY);
                        }
                        e.stroke();
                    }
                }
            }
        };
        e.createBoulder = function() {
            var e, t, n, r;
            e = new S;
            for (t = 0; t < 30; ++t) {
                n = s(3, k - 3);
                r = s(0, L - 1);
                if (this.isPlaceable(n, r)) {
                    e.setGridCoords(n, r);
                    this.objs.push(e);
                    return e;
                }
            }
        };
        e.newGame = function() {
            var e, t, n, r;
            this.credits = 15;
            for (e = 0; e < 7; ++e) this.towerTray.push(new b(_.initialize()));
            t = new w;
            t.setGridCoords(0, 0 | Math.random() * L - 1);
            this.objs.push(t);
            this.heart = n = new E;
            n.setGridCoords(k - 1, 0 | Math.random() * L - 1);
            this.objs.push(n);
            for (r = 0; r < 10; ++r) this.createBoulder();
        };
        e.sellTower = function(e) {
            var t, n, r, i;
            for (t = 0, r = (n = this.towers).length; t < r; ++t) {
                i = n[t];
                if (e == i) {
                    e.onStage = !1;
                    this.towers.splice(t, 1);
                    this.credits += 3;
                    p.play("sell");
                    break;
                }
            }
        };
        e.cloneTower = function(e) {
            var t;
            p.play("clone");
            t = new b(_.evolve(e.attributes, e.attributes, this.towerMutationRate));
            this.towerTray.push(t);
            t.generation = e.generation;
            this.credits -= 10;
        };
        e.totalEnemiesLeft = function() {
            var e, t, n, r, i;
            e = 0;
            for (t = 0, r = (n = this.objs).length; t < r; ++t) {
                i = n[t];
                i.enemiesLeft && (e += i.enemiesLeft);
            }
            return e;
        };
        return n;
    }();
    C = function(e, t) {
        return e >= 0 && e < k && t >= 0 && t < L;
    };
    k = 25;
    L = 17;
    A = null;
    O = 0;
    M = {
        routes: !1
    };
    _ = new g({
        height: new m,
        baseWidth: new m,
        topWidth: new m,
        form: new m,
        range: new m,
        hue: new m,
        hueTop: new m,
        ammoSpeed: new m,
        ammoDamage: new m,
        ammoRange: new m,
        ammoDeceleration: new m,
        shootSpeed: new m,
        reloadAmmo: new m,
        reloadSpeed: new m,
        acquisitionSpeed: new m,
        maxRange: new m,
        slowingAmmo: new m,
        homingAmmo: new m
    });
    D = {
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
    P = new g({
        speed: new m,
        health: new m,
        hue: new m,
        size: new m,
        flying: new m
    });
    (function(e, t) {
        var n, r, s, o, u, a, f, c, h, d, v, m, g, y, w, E, S;
        n = null;
        r = null;
        s = {
            b: !1,
            x: 0,
            y: 0,
            down: {}
        };
        o = null;
        u = null;
        a = null;
        f = null;
        c = function(e) {
            a = e + "";
        };
        h = function() {
            var e, t, n, a, l, h, d, v, m, g;
            if (o && C(s.gridX, s.gridY)) {
                e = A.isPlaceable(s.gridX, s.gridY);
                r.beginPath();
                r.strokeStyle = e ? "white" : "red";
                r.lineWidth = 2;
                r.rect(s.gridX * 32, s.gridY * 32, 32, 32);
                r.stroke();
                e && c("Place tower");
            }
            u && !u.onStage && (u = null);
            t = !0;
            if (A.towerTray.length >= 10) {
                t = !1;
                n = "Too many towers in tray";
            }
            if (A.credits < 5) {
                t = !1;
                n = "Not enough credits";
            }
            a = null;
            if (!o) for (l = 0, d = (h = A.towers).length; l < d; ++l) {
                v = h[l];
                if (u == v || v.gridX == s.gridX && v.gridY == s.gridY) {
                    f = v;
                    if (u && u != v) if (t) {
                        a = v;
                        r.strokeStyle = "magenta";
                        c("Evolve towers (5 CR)");
                        r.lineWidth = 1;
                        r.beginPath();
                        for (m = 0; m < 3; ++m) {
                            r.moveTo(v.x + i(-5, 5), v.y + i(-5, 5));
                            r.lineTo(u.x + i(-5, 5), u.y + i(-5, 5));
                        }
                        r.stroke();
                    } else {
                        r.strokeStyle = "red";
                        c("Can't evolve: " + n);
                    }
                    r.beginPath();
                    r.strokeStyle = u == v ? "magenta" : "purple";
                    r.lineWidth = 4;
                    r.rect(v.gridX * 32, v.gridY * 32, 32, 32);
                    r.stroke();
                    if (s.b) if (t && u && u != v) {
                        p.play("evolve");
                        g = new b(_.evolve(u.attributes, v.attributes, A.towerMutationRate));
                        g.generation = Math.max(u.generation, v.generation) + 1;
                        A.credits -= 5;
                        A.towerTray.push(g);
                        u = null;
                        o = g;
                    } else u = v;
                }
            }
            a && (f = a);
            if (u) {
                r.strokeStyle = "silver";
                r.lineWidth = 1;
                r.beginPath();
                r.arc(u.x, u.y, u.actual.maxRange, 0, 6.282);
                r.stroke();
                r.strokeStyle = "gray";
                r.beginPath();
                r.arc(u.x, u.y, u.actual.ammoRange, 0, 6.282);
                r.stroke();
            }
            A.draw(r);
        };
        d = function() {
            var e, t, n, i, a, h;
            r.strokeStyle = "cyan";
            r.lineWidth = 1;
            r.beginPath();
            r.moveTo(0, 544);
            r.lineTo(800, 544);
            r.moveTo(800, 0);
            r.lineTo(800, 600);
            r.stroke();
            r.beginPath();
            r.fillStyle = "silver";
            r.font = "14px " + l;
            e = A.totalEnemiesLeft();
            if (A.gameOver) {
                r.fillStyle = "red";
                r.fillText("GAME OVER.", 820, 530);
            } else if (e <= 0) {
                r.fillStyle = "lime";
                r.fillText("YOU WIN!", 820, 530);
            }
            r.fillText("Credits: " + A.credits, 820, 550);
            r.fillText("Core Health: " + A.heart.health, 820, 570);
            r.fillText("Enemies Left: " + e, 820, 590);
            A.towerTray.length == 0 && r.fillText("Click on two towers to evolve them!", 16, 570);
            if (A.towers.length == 0) {
                r.fillStyle = O * 4 % 1 < .5 ? "silver" : "white";
                r.fillText("Click on a tower below to place it.", 16, 530);
            }
            for (t = 0, i = (n = A.towerTray).length; t < i; ++t) {
                a = n[t];
                r.save();
                h = 16 + t * 32;
                r.translate(h, 585);
                if (s.x >= h - 16 && s.x < h + 16 && s.y > 544 || o == a) {
                    o != a && c("Select tower to place");
                    if (s.b) {
                        o = a;
                        u = null;
                    }
                    r.beginPath();
                    r.strokeStyle = a == o ? "white" : "magenta";
                    r.rect(-15, -15, 30, 30);
                    r.stroke();
                    f = a;
                }
                a.draw(r);
                r.restore();
            }
        };
        v = function() {
            var e, t, n, i, s, o, u, a, c;
            if (!f) return;
            e = f.actual;
            r.font = "14px " + l;
            r.beginPath();
            r.fillStyle = "white";
            t = 20;
            n = [];
            n.push("Generation " + f.generation);
            for (i in e) {
                s = e[i];
                if (i = D[i]) {
                    o = s == (0 | s) ? s + "" : s.toFixed(2);
                    n.push(i + ": " + o);
                }
            }
            n.push(null);
            e.maxAmmo < 10 && n.push("Low ammo");
            e.reloadTime > 5 && n.push("Slow reload");
            e.maxRange < 50 && n.push("Low range of acquisition");
            e.acqInterval > 3 && n.push("Slow acquisition");
            e.ammoRange < 120 && n.push("Low-range ammo");
            e.ammoDamage < 12 && n.push("Low damage ammo");
            e.shotInterval < .1 && n.push("Rapid fire");
            e.ammoSpeed > 12 && n.push("Fast ammo");
            e.ammoDamage > 30 && n.push("High ammo damage");
            e.maxRange > 150 && n.push("Long range of acquisition");
            e.ammoRange > 250 && n.push("Long-range ammo");
            e.acqInterval < 2 && n.push("Fast acquisition");
            e.reloadTime < 2 && n.push("Fast reload");
            e.slowingAmmo && n.push("Ammo slows enemies");
            e.homingAmmo && n.push("Ammo homes on enemies");
            if (f.onStage) {
                n.push(null);
                n.push("[S] Sell tower (+3 CR)");
                A.credits >= 10 && n.push("[C] Clone tower (-10 CR)");
            }
            for (u = 0, a = n.length; u < a; ++u) {
                c = n[u];
                c && r.fillText(c, 815, t);
                t += 20;
            }
        };
        m = function() {
            var e, t, n;
            r.fillStyle = "#000";
            r.fillRect(0, 0, 1024, 600);
            a = null;
            f = null;
            h();
            r.fillStyle = "#000";
            r.fillRect(800, 0, 224, 600);
            d();
            f && v();
            if (a) {
                r.font = "12px " + l;
                e = r.measureText(a).width;
                t = s.x + 10;
                t + e + 5 > 800 && (t = s.x - 10 - e);
                n = Math.min(580, s.y - 5);
                t += .5;
                n += .5;
                r.fillStyle = "rgba(0,0,0,0.5)";
                r.strokeStyle = "white";
                r.lineWidth = 1;
                r.beginPath();
                r.rect(t, n, e + 6, 16);
                r.fill();
                r.stroke();
                r.beginPath();
                r.fillStyle = "white";
                r.fillText(a, t + 2, n + 12);
            }
        };
        g = function() {
            var e, t;
            e = s.gridX;
            t = s.gridY;
            if (o && C(e, t)) {
                o && A.isPlaceable(e, t) && A.placeTower(o, e, t);
                o = null;
            }
            u && C(e, t) && A.isPlaceable(e, t) && (u = null);
        };
        y = function(e) {
            e == 115 && f && f.onStage && A.sellTower(f);
            e == 99 && f && A.credits >= 10 && A.towerTray.length < 10 && A.cloneTower(f);
            e == 97 && A.towerTray.length > 0 && (o = A.towerTray[0]);
        };
        w = function() {
            O += 1 / 22;
            m();
        };
        E = function() {
            A = new N;
            A.newGame();
        };
        S = function() {
            var t, i;
            t = function(t) {
                return e.getElementById(t);
            };
            n = t("canvas");
            r = n.getContext("2d");
            i = function(e, t) {
                var n, r;
                e.x = t.offsetX || t.clientX;
                e.y = t.offsetY || t.clientY;
                n = 0 | e.x / 32;
                r = 0 | e.y / 32;
                if (C(n, r)) {
                    e.gridX = n;
                    e.gridY = r;
                } else e.gridX = e.gridY = -1;
            };
            n.addEventListener("mousedown", function(e) {
                s.b = !0;
                i(s, e);
                i(s.down, e);
            }, !1);
            n.addEventListener("mouseup", function(e) {
                s.b = !1;
                i(s, e);
            }, !1);
            n.addEventListener("mousemove", function(e) {
                i(s, e);
            }, !1);
            n.addEventListener("click", function(e) {
                i(s, e);
                g();
            }, !1);
            e.addEventListener("keypress", function(e) {
                y(e.keyCode || e.charCode);
            }, !1);
            p.load("core-hit", "core-hit2.wav");
            p.load("ammo-hit", "ammo-hit.wav");
            p.load("kill", "kill.wav");
            p.load("tower-hurt", "tower-hurt.wav");
            p.load("place", "place.wav");
            p.load("shoot", "shoot.wav");
            p.load("evolve", "evolve.wav");
            p.load("clone", "clone.wav");
            p.load("sell", "sell.wav");
            E();
            setInterval(w, 1e3 / 22);
        };
        t.EvoTD = {
            init: S,
            debug: M,
            newGame: E,
            getWorld: function() {
                return A;
            },
            setSounds: function(e) {
                p.setEnabled(e);
            }
        };
    }).call(this, document, window);
}).call(this);