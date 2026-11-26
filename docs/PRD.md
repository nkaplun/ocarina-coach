# Ocarina Coach: Product Requirements (v0.1)

Author: Nicholas Kaplun. Status: draft for HW4, candidate idea for Project 3.

## 1. Problem

Beginners learning the ocarina have two problems that a printed fingering chart can't fix:

1. **They don't know if they are in tune.** Ocarina pitch changes with breath pressure, so a correct fingering can still sound flat or sharp. Without a teacher, beginners can't hear the difference.
2. **Charts and songs live in different places.** Learners flip between a fingering chart, sheet music, and a tuner app.

## 2. Product

A web app that shows learners which holes to cover, listens to them play through the microphone, and tells them right away whether they played the right note and whether it was in tune.

**Supported instrument (v1):** 12-hole Alto C ocarina, range A4 to F6. Other ocarina types are out of scope for v1.

## 3. Users

| Role | Needs |
|---|---|
| **Learner** | See fingerings, practice single notes with live feedback, play through songs, track progress |
| **Teacher** (P3 stretch) | Assign songs to learners and see their practice results |

## 4. Features

Each feature lists acceptance criteria (AC) written as testable statements.

### F1. Fingering chart

Pick a note and see a drawing of the ocarina with the holes to cover filled in.

- AC1: The chart lists every note from A4 to F6 in order (21 notes, naturals and sharps/flats).
- AC2: Selecting a note shows a drawing with 12 holes; covered holes are filled, open holes are empty.
- AC3: The drawing has an accessible text label naming the note and which holes are covered.
- AC4: Fingerings are stored as data (one list of covered holes per note), not as image files.
- AC5: Notes outside the instrument's range are rejected with a clear message.
- AC6: Shows the selected note's target pitch in Hz, rounded to one decimal (for example C5 shows 523.3 Hz), so learners know what the tuner should read. An invalid note shows no pitch, only the AC5 message.

### F2. Note detection (pitch to note)

Turn a measured frequency into a note name and a tuning reading.

- AC1: Converts a frequency in Hz to the nearest note name and octave using A4 = 440 Hz (for example 440 Hz returns A4, 523.25 Hz returns C5).
- AC2: Returns how far off the pitch is in cents (100 cents = one semitone), from -50 to +50.
- AC3: Reports "in tune" when within plus or minus 15 cents of the target note, "flat" or "sharp" otherwise.
- AC4: Rejects frequencies that are zero, negative, not a number, or outside the ocarina's range (with some margin).
- AC5: Given a target note and a measured frequency, says whether the learner played the right note.

### F3. Live practice

Hold a note and get feedback in real time.

- AC1: Asks for microphone permission and explains why; shows a clear message if denied.
- AC2: Ignores sound below a volume threshold so room noise doesn't register as notes.
- AC3: Shows the detected note, a flat/in-tune/sharp meter, and a green/red match against the target.
- AC4: Counts a note as "hit" only after it is held in tune for 0.5 seconds.

### F4. Song lessons

Play through a public-domain song one note at a time.

- AC1: Song list includes only public-domain or original melodies (for example "Ode to Joy", "Twinkle Twinkle Little Star").
- AC2: Shows the current note's fingering and advances when the learner hits it.
- AC3: Shows a score at the end (notes hit, average cents off).

### F5. Accounts and progress (P3)

- AC1: Sign in with email (Auth.js).
- AC2: Each completed practice session and song attempt is saved to Postgres.
- AC3: A progress page shows sessions over time and the notes the learner most often misses.

## 5. Out of scope (v1)

Other ocarina types, sheet music import, recording and playback, mobile apps, paid features.

## 6. Technical notes

- **Stack:** Next.js (App Router) + TypeScript + Tailwind, Postgres, Auth.js, Vercel.
- **Pitch detection** runs entirely in the browser (Web Audio API plus the `pitchy` library). No audio leaves the device.
- **Microphone access requires HTTPS**, which Vercel provides.
- **Testing:** pitch logic is pure functions tested with known frequencies and generated sine waves, so no microphone is needed in tests.

## 7. Security and privacy

- Audio is processed locally and never uploaded or stored.
- Only practice results (note, cents off, timestamp) are saved, and only for signed-in users.
- All user input (song IDs, note names) is validated on the server before touching the database.
