---
description: End-to-end viral game creation - research trends, design, build, and polish a Unity 2D game for Instagram/YouTube content
---

# 🎮 Viral Game — Fully Autonomous One-Shot Implementation

This workflow creates a complete Unity 2D game from scratch, optimized for viral social media content (Instagram Reels / YouTube Shorts). **The entire process is AI-driven — zero hand-holding.** The AI researches, builds, sets up scenes programmatically, tests the game itself, reviews its own work, and only presents the finished product for final approval.

> [!IMPORTANT]
> **Zero Manual Work Principle**: The user should NOT have to drag-and-drop anything, configure any Inspector values, or manually set up any scenes. Everything must be done programmatically via Editor scripts. The AI must test and review its own work before asking for any human input.

## Available Tools

- **Unity MCP** — Create scripts, shaders, folders, and manage the Unity project directly
- **Blender MCP** — Create custom 2D sprites, textures, icons, backgrounds, UI elements, render 3D→2D sprite sheets
- **Web Search** — Research viral trends and references
- **Web Downloads** — Download free assets from trusted sources (with user confirmation)
- **Image Generation** — Generate sprites, backgrounds, UI mockups via AI

> [!CAUTION]
> **Online Downloads**: Only from trusted sources (Kenney.nl, OpenGameArt, Freesound.org, Google Fonts). Always confirm with user before downloading. Verify file types and licenses.

## Prerequisites
- Unity project must be open with the MCP server running
- Blender must be open with the MCP server running
- Project should be set up for 2D (URP or Built-in 2D)

---

## Phase 1: Trend Research & Game Ideation

1. **Search for what's currently viral** — Use web search to find:
   - Trending topics on Instagram Reels / YouTube Shorts / TikTok
   - Viral game mechanics (satisfying physics, oddly satisfying loops, rage games, one-tap games)
   - Trending memes or cultural moments that can be gamified
   - Search queries: "viral mobile game", "satisfying game mechanics TikTok", "trending game concepts Instagram reels"

2. **Pick the best concept** — Select based on:
   - **Visual appeal**: Must look amazing in a 10-30 second clip
   - **Instant understanding**: Viewer gets it in 1 second
   - **Satisfying loop**: Has a satisfying "payoff" moment
   - **2D feasible**: Sprites, particles, simple physics
   - **Build time**: Implementable in one session

3. **Document the concept** as an implementation plan (do NOT ask user to review yet — proceed straight to building)

---

## Phase 2: Asset Creation (Blender + Downloads + AI Generation)

4. **Create custom assets in Blender** via MCP:
   - Model and render 2D sprites from 3D objects (orthographic → PNG)
   - Create textured backgrounds, tile sets, patterns
   - Generate UI elements (buttons, frames, icons)
   - Create sprite sheets (multiple frames for animation)
   - Export as PNG to the Unity project's Assets/Sprites/ folder

5. **Download free assets** (if needed, with user confirmation):
   - Sprites: Kenney.nl (CC0), OpenGameArt.org
   - Fonts: Google Fonts
   - SFX: Freesound.org (CC0), Mixkit.co

6. **Generate assets via AI** (if needed):
   - Sprite textures, backgrounds, UI mockups

---

## Phase 3: Project Setup

7. **Check the Unity project** via MCP:
   - Ping Unity, get project info, list existing assets

8. **Create folder structure** via MCP:
   ```
   Assets/
   ├── Scripts/
   ├── Scripts/Editor/    ← Editor scripts for auto scene setup
   ├── Scenes/
   ├── Prefabs/
   ├── Materials/
   ├── Sprites/
   ├── Audio/
   ├── Fonts/
   └── Shaders/
   ```

---

## Phase 4: Implementation (One-Shot Build)

9. **Build core game scripts**:
    - GameManager (state machine: Menu → Play → Win/Lose → Replay)
    - Core mechanic controller
    - Input handler (touch/click)
    - Score/Progress tracker
    - Visual feedback systems (particles, screen shake, color flash)

10. **Create visual polish scripts**:
    - Camera shake / zoom effects
    - Particle system spawner
    - Juice effects (squash & stretch, trail renderers)
    - UI animations (score pop, combo counter)
    - Background color lerping / gradient effects

11. **Create shaders** (if needed):
    - Glow/bloom effects, color cycling, dissolve effects

---

## Phase 5: Programmatic Scene Setup (NO MANUAL WORK)

> [!IMPORTANT]
> This is critical. The user must NOT have to drag-and-drop anything. Create an Editor script that builds the entire scene programmatically.

12. **Create an Editor script** (`Assets/Scripts/Editor/SceneBuilder.cs`) that:
    - Has a menu item: `[MenuItem("ViralGame/Build Scene")]` so it appears in the Unity menu bar
    - When run, it programmatically:
      - Creates a new scene or clears the current one
      - Creates ALL GameObjects with correct hierarchy
      - Attaches ALL components (scripts, renderers, colliders, etc.)
      - Sets ALL Inspector values (transforms, colors, references, physics settings)
      - Creates and assigns materials
      - Sets up the camera (orthographic, correct size, background color)
      - Creates the Canvas + UI elements (score text, buttons, etc.)
      - Sets up particle systems with correct parameters
      - Configures sorting layers and render order
      - Wires up ALL cross-references between scripts
      - Saves the scene to Assets/Scenes/
      - Sets it as the active scene in Build Settings

13. **Create a secondary Editor script** (`Assets/Scripts/Editor/GameValidator.cs`) that:
    - Has a menu item: `[MenuItem("ViralGame/Validate Game")]`
    - Checks that all required GameObjects exist
    - Checks that all script references are wired (no null refs)
    - Checks that all sprites/materials are assigned
    - Checks camera settings are correct for recording
    - Checks canvas scaling mode
    - Outputs a pass/fail report to the Console
    - Returns a list of any issues found

14. **Run the scene builder**:
    - After creating all scripts, tell the user to click `ViralGame > Build Scene` in the menu bar
    - Then tell them to click `ViralGame > Validate Game` to verify
    - This is the ONLY manual action the user takes — two menu clicks

---

## Phase 6: AI Self-Testing & Review

> [!IMPORTANT]
> The AI must test and review its own work BEFORE asking for any human input. Do NOT present unfinished or untested work to the user.

15. **Code Review** — The AI reviews ALL scripts it created:
    - Read back every script via `unity_read_script`
    - Check for compilation errors, missing references, logic bugs
    - Verify all public fields will be set by the SceneBuilder
    - Check for common Unity pitfalls (Update vs FixedUpdate for physics, null checks, etc.)
    - Check that game loop is complete (start → play → end → restart)
    - Fix any issues found, then re-read and re-verify

16. **Scene Validation Review** — After the scene builder runs:
    - Read the GameValidator script output
    - If issues exist, fix them and re-run validation
    - Verify the scene has everything: camera, canvas, game objects, particle systems

17. **Gameplay Logic Review** — AI mentally walks through the game:
    - Simulate the player flow: launch → see menu → tap to start → play → score → end → restart
    - Check edge cases: what happens on rapid tapping? What if player does nothing?
    - Verify the "viral moment" is achievable in normal gameplay
    - Check that visual effects trigger at the right moments

18. **Visual Quality Review**:
    - Verify color palette is cohesive (not random Unity defaults)
    - Check that particle effects, screen shake, and juice are properly configured
    - Verify the recording resolution is set correctly (9:16 or 16:9)
    - Ensure no placeholder text, missing sprites, or default Unity grey

19. **Generate a self-review report** documenting:
    - ✅ What passed
    - ⚠️ What was fixed
    - 📋 Known limitations
    - 🎬 Instructions for recording the viral clip

---

## Phase 7: Polish for Viral Content

20. **Optimize for recording**:
    - Portrait mode (9:16) for Reels/Shorts OR landscape (16:9) for YouTube
    - Resolution: 1080x1920 or 1920x1080
    - Target: consistent 60fps

21. **Content moments baked in**:
    - Satisfying payoff moments with particle bursts
    - Perfect loop potential
    - Escalating chaos/difficulty for drama
    - Big visual climax

---

## Phase 8: Final Delivery to User

> [!IMPORTANT]
> Only present to the user AFTER all self-testing passes. The user should receive a FINISHED product.

22. **Present to user with**:
    - Summary: what the game is and why it's viral
    - Two actions needed: `ViralGame > Build Scene`, then `ViralGame > Validate Game`
    - Hit Play and record
    - Content guide: caption, hashtags, music suggestion, hook strategy
    - Self-review results: what was tested and what passed

---

## Output Checklist
- [ ] Trend research completed — concept selected
- [ ] Custom assets created (Blender / downloaded / generated)
- [ ] All game scripts created via Unity MCP
- [ ] Editor SceneBuilder script creates the entire scene programmatically
- [ ] Editor GameValidator script verifies scene integrity
- [ ] AI code review completed — all scripts verified
- [ ] AI gameplay logic review completed
- [ ] AI visual quality review completed
- [ ] Self-review report generated
- [ ] Content guide with captions, hashtags, recording instructions
- [ ] ONLY THEN: presented to user for final play + record
