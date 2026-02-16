import { describe, it, expect } from "vitest"
import LaserGameEngine from "../Core/LaserGameEngine"

describe("LaserGameEngine", () => {

  it("starts in IDLE state", () => {
    const game = new LaserGameEngine()
    expect(game.state).toBe("IDLE")
  })

  it("transitions to PLAYING", () => {
    const game = new LaserGameEngine()
    game.start()
    expect(game.state).toBe("PLAYING")
  })

  it("loses when laser hits selected row", () => {
    const game = new LaserGameEngine(3)
    game.start()
    game.select(1, 1)

    const result = game.resolveLaser(true, 1)

    expect(result.result).toBe("LOSE")
    expect(game.state).toBe("ENDED")
  })

  it("wins when reduced to 1x1", () => {
    const game = new LaserGameEngine(1)
    game.start()
    game.select(0, 0)

    const result = game.resolveLaser(false, 0)

    expect(result.result).toBe("WIN")
  })

  it("multiplier increases after survival", () => {
    const game = new LaserGameEngine(3)
    game.start()
    game.select(0, 0)

    game.resolveLaser(true, 1) 

    expect(game.getMultiplier()).toBeGreaterThan(1)
  })

  it("calculates winnings correctly", () => {
    const game = new LaserGameEngine(3, 50) 
    game.start()
    game.select(0, 0)
    
    const winnings = game.getWinnings()
    const multiplier = game.getMultiplier()
    
    expect(winnings).toBe(50 * multiplier)
  })

})
