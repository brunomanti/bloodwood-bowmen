# Bloodwood Bowmen: Reserve Line full-game spec

Release build: `bloodwood-bowmen-v20260620-0818-reserve-line`

## Design target

Turn the toy duel into a compact real mobile action game: every shot should matter, enemies should feel like opponents rather than scenery, the camera should sell the projectile drama, and victory should flow into the next encounter without menu work.

Reserve Line iteration adds a more tactical view: the game starts zoomed far out so the whole duel lane is legible. Duel levels are pure archer duels with no targets, because target props created inappropriate shields. A new Reserve Line level models a small battle line: when a bowman falls, the next reserve steps into the same role until one side runs out.

## Core loop

1. Player enters a level with a short banner explaining the objective.
2. Player draws and releases an arrow using the existing strong cumulative/line-start gesture.
3. Camera follows the arrow through the lane toward the intended target.
4. Hits create shake, flash, particles, floating callouts, and HP loss. Misses hit ground with smaller dust/shock feedback.
5. In duel levels, the rival returns fire. Rival shots are ballistic solutions aimed at the player with randomized error.
6. Defeating all target marks or downing the rival completes the level and automatically advances.
7. In line levels, defeating one fighter does not immediately end the level if that side has reserves; a replacement enters, arrows are cleared, and play continues.

## Opponent AI

- Each duel enemy has a `skill` value. Level index contributes a difficulty factor.
- AI solves a ballistic trajectory toward the player using current gravity and wind.
- The miss model is target-point error, not arbitrary angle noise: high skill/difficulty means smaller random error; low skill creates broad misses.
- Some misses are intentional near-misses so early levels remain readable and later levels still have tension.
- Telemetry records skill, difficulty, accuracy, random error, near-miss flag, time-of-flight, and target point for smoke tests.

## Camera

- During flight, the camera pans toward the newest arrow, leading slightly in the arrow direction.
- When no arrow is flying, the camera returns to the player or frames the duel while the rival is acting.
- Camera shake scales with impact power.

## Hit feel

- Bowman hits: body recoil, warm flash, stronger explosion, screen shake, floating text.
- Target hits: hit/shatter callouts, scaled particles, shock rings.
- Level completion: banner announces automatic move to next line.

## Progression

- Target-only levels complete when every target is destroyed.
- Duel levels contain no target marks and complete when the rival falls.
- Line levels maintain `playerReserve` and `enemyReserve`; player death spawns the next player reserve, enemy death spawns the next enemy reserve, and the level ends only when the enemy line is exhausted.
- Completion always queues `loadLevel(next)` with wraparound.
- All levels remain open from menu for testing and replay.

## Verification requirements

- Static tests must assert the new build ID, AI ballistic/error model, camera follow hooks, hit feedback hooks, and auto progression.
- Browser smoke must verify the live build, menu operation, no console errors, AI shot telemetry, camera focus on arrows, and level auto-advance after forced completion.
