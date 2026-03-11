IUS DRRP Prototype Demo
https://iusmusic.github.io/IUS-DRRP/

Standalone HTML Preview:
https://iusmusic.github.io/DRRPDEMO/


If the app shows only text on a phone, the browser is usually not loading the css files.

A portable, hi-res audio device that combines local playback, recording, and FM/DAB radio in a single tactile interface.



IUS DRRP
Technical Device Description and Internal Architecture
Version: v0.1

====================================================================

1. DEVICE IDENTIFICATION
====================================================================

Official device name:
IUS DRRP

Expanded working name:
IUS DRRP = IUS Digital Radio / Recorder / Player

Device class:
Portable offline-first hi-res audio playback, recording, and radio device.

Primary intended function:
A self-contained, tactile, low-latency audio instrument/device capable of:

* local high-quality audio playback
* local high-quality audio recording
* offline radio reception (FM and/or DAB depending on hardware variant)
* headphone monitoring
* dedicated line-level input and output
* operation without dependence on cloud services or smartphone-style UI

====================================================================
2. EXECUTIVE TECHNICAL SUMMARY
==============================

IUS DRRP is a portable, offline-first digital audio device designed around a Linux-based compute module, dedicated DAC/ADC audio hardware, physical transport and mode controls, and a compact visual interface. The product is intended to merge the functional roles of a local audio player, field/line recorder, and offline radio receiver into a single coherent hardware platform.

The design objective is to avoid touchscreen-centric interaction and instead provide a hardware-first user experience with deterministic controls, explicit signal paths, visible radio mode, and transparent audio I/O. The system is engineered as an instrument-grade device rather than a generic consumer media player.

The current technical direction is based on a Raspberry Pi 4 compute subsystem paired with a dedicated DAC+ADC audio HAT, additional headphone amplification, offline local storage, and a high-contrast compact OLED display system.

====================================================================
3. CORE PRODUCT GOALS
=====================

3.1 Functional goals

* Provide high-quality local audio playback from offline media.
* Provide high-quality local recording from external line-level sources.
* Provide offline radio capability, with radio treated as a visible primary feature.
* Provide separate headphone output and line output paths.
* Maintain low-latency, tactile, deterministic interaction.
* Eliminate dependence on phone applications or cloud-connected control.

3.2 User-experience goals

* Retro-modern hardware interface.
* Immediate comprehension of primary functions.
* Physical buttons and rotary controls for transport, navigation, tuning, and volume.
* Display-driven information system with explicit status visibility.
* Product identity should feel like a dedicated audio instrument, not a general-purpose computer.

3.3 Engineering goals

* Modular internal architecture.
* Prototype-first hardware stack using commercially available modules/HATs.
* Migration path toward more integrated/custom hardware in later revisions.
* Support for small-batch UK-based design, assembly, QA, and serviceability.

====================================================================
4. PRIMARY USE CASES
====================

4.1 Playback use cases

* Local playback from microSD-based audio library.
* Optional local playback from USB-attached storage.
* Support for lossless and high-quality formats.
* Dedicated headphone listening.
* Line-out feed into external speaker systems, amplifiers, or studio monitors.

4.2 Recording use cases

* Stereo line-in recording from external devices.
* Capturing from synthesizers, instruments, mixers, media devices, or radio feed.
* Monitoring through headphone output.
* Logging and display of active recording state.

4.3 Radio use cases

* Offline FM listening.
* Optional DAB/DAB+ integration for UK market variants.
* Radio mode with explicit display indication.
* Optional radio capture/record-to-storage workflow.

====================================================================
5. SYSTEM ARCHITECTURE OVERVIEW
===============================

High-level functional architecture:

[Local Storage] ----->

> [Compute Core / Playback + UI + Control Logic] --> [DAC / ADC Audio Board] --> [Line Out]
[Radio Tuner] ------> /                                              --> [Headphone Amplifier] --> [Headphone Out]
--> [Recording Path / Storage]
[Line In / Aux In] -----------------------------------------------> [ADC Input Stage]

Core subsystems:

* Compute subsystem
* Audio subsystem
* Display/UI subsystem
* User input/control subsystem
* Radio subsystem
* Storage subsystem
* Power subsystem
* Mechanical enclosure and thermal subsystem

====================================================================
6. COMPUTE SUBSYSTEM
====================

Current preferred processor platform:
Raspberry Pi 4, 2GB RAM

Rationale for platform choice:

* Better UI responsiveness than smaller Pi variants.
* Greater processing headroom for playback, recording, display rendering, and radio control.
* Mature Linux software support.
* Large ecosystem for prototyping and development.
* Suitable for fast proof-of-concept without requiring custom SBC design.

Expected role of compute subsystem:

* Operating system host
* Media library management
* Playback engine control
* Recording engine control
* OLED/GUI update logic
* Physical input interpretation
* Radio tuner control
* File system and storage management
* Audio routing configuration
* Logging and service supervision

Operating system direction:

* Linux-based
* Lightweight distribution preferred
* Minimal desktop overhead
* Audio-focused deployment

Preferred software philosophy:

* Low overhead
* Deterministic services
* Avoidance of unnecessary graphical stacks
* Explicit control over audio routing and sample-rate behavior

====================================================================
7. AUDIO SUBSYSTEM
==================

7.1 Core audio board
Selected concept hardware:
HiFiBerry DAC+ ADC

Role:

* Provides dedicated DAC functionality for playback.
* Provides dedicated ADC functionality for recording.
* Supplies line-level output path.
* Supplies line-level input path.

Reason for selection:

* Combined playback and recording capability in one board.
* Cleaner prototype architecture than using separate DAC-only and ADC-only boards.
* More suitable for the recorder/player/radio concept than playback-only HATs.

7.2 Headphone stage
Additional required subsystem:
Dedicated headphone amplifier stage.

Reason:
Line-level output from DAC/ADC board is not sufficient for broad headphone compatibility or proper headphone drive. A separate amplification stage is required to support usable headphone monitoring and portable playback ergonomics.

Headphone path logic:

* Fixed line output remains available independently.
* Variable headphone output is driven by the dedicated headphone amp.

7.3 Audio format strategy
Target practical quality levels:

* FLAC 16-bit / 44.1 kHz as baseline high-quality format.
* Optional support for 24-bit / 48 kHz as first meaningful hi-res tier.

Design philosophy:
The product prioritizes transparent real-world playback and recording quality through good converter stages, correct signal routing, and physical I/O quality rather than pursuing extreme sample-rate marketing.

====================================================================
8. AUDIO SIGNAL PATHS
=====================

8.1 Playback path
[Storage / File System]
--> [Playback Engine]
--> [Digital Audio Output]
--> [DAC section of DAC+ADC board]
--> [Line Out]
--> [Headphone Amplifier]
--> [Headphone Out]

8.2 Recording path
[Line In / Aux In]
--> [ADC section of DAC+ADC board]
--> [Recording Engine]
--> [Storage / File System]

8.3 Radio monitoring path
[Radio Tuner Module]
--> [Analog feed or digital interface depending on module choice]
--> [System audio path]
--> [Line Out and/or Headphone Out]

8.4 Radio record path
[Radio Tuner Audio]
--> [ADC / Recording path]
--> [Storage]

====================================================================
9. I/O ARCHITECTURE
===================

9.1 Required external I/O

* Headphone Out
* Line Out
* Line In / Aux In
* USB-C (power and/or service/data depending revision)
* microSD storage access
* Optional USB host/device role depending implementation
* Optional antenna input or internal antenna feed for radio

9.2 Core analog I/O strategy
Headphone Out:

* Separate amplified output path
* Intended for direct user monitoring/listening
* Variable output level

Line Out:

* Fixed level
* Intended for monitors, amplifiers, mixers, or external recorders

Line In / Aux In:

* Intended for external stereo recording source
* Consumer line-level compatibility required
* Protection/conditioning to be considered in final hardware revision

9.3 Text-based I/O mapping (conceptual)

PORT_01 = HEADPHONE_OUT
TYPE    = Analog stereo output
LEVEL   = Amplified / variable
PATH    = DAC -> Headphone Amp -> Jack

PORT_02 = LINE_OUT
TYPE    = Analog stereo output
LEVEL   = Fixed line level
PATH    = DAC -> Line Output stage

PORT_03 = LINE_IN
TYPE    = Analog stereo input
LEVEL   = Line/Aux input
PATH    = Jack -> ADC input stage

PORT_04 = USB_C
TYPE    = Power / service / data depending revision
LEVEL   = 5V system input minimum
ROLE    = Charging / power / maintenance / file service (revision dependent)

PORT_05 = MICRO_SD
TYPE    = Local storage media
ROLE    = Media library + recording destination + system storage

PORT_06 = RADIO_ANTENNA (optional visible or internal)
TYPE    = RF input / antenna interface
ROLE    = FM / DAB radio front end

====================================================================
10. DISPLAY AND UI SUBSYSTEM
============================

Selected display direction:
256 x 64 OLED

Display function goals:

* now playing metadata
* playback time / progress
* recording state
* radio frequency / band / station details
* signal level / visual meter / EQ-style display
* system status

Design goals for UI:

* Immediate readability
* Minimal hierarchy confusion
* Strong radio visibility
* Strong mode visibility
* No smartphone-like dependency
* Hardware and display treated as one system

====================================================================
11. CONTROL SUBSYSTEM
=====================

Physical controls expected:

* Transport buttons (play, pause, previous, next, etc.)
* Mode button(s), including explicit RADIO access
* Rotary controls / encoders / knobs
* Optional function button(s) such as EQ/MODE/TUNE

Portable version industrial design direction:

* Handheld form factor
* Two side rotary knobs
* Side-mounted jacks
* Front-facing display and transport control cluster
* Large visible RADIO mode button

Conceptual control mapping:

CTRL_01 = PLAY_PAUSE
CTRL_02 = PREVIOUS_TRACK / SEEK_BACK
CTRL_03 = NEXT_TRACK / SEEK_FORWARD
CTRL_04 = RADIO_MODE
CTRL_05 = MENU / EQ / MODE (revision dependent)
CTRL_06 = VOLUME_KNOB
CTRL_07 = TUNE_OR_SELECT_KNOB

====================================================================
12. RADIO SUBSYSTEM
===================

Primary requirement:
Offline radio compatibility.

Radio positioning within product:
Radio is not a hidden secondary feature. It is a core, visible identity component of the device.

Supported/considered radio standards:

* FM (simpler first integration path)
* DAB/DAB+ (higher relevance for UK market, higher integration complexity)

Radio engineering concept:

* Tuner module controlled by main compute subsystem
* Audio routed into system playback path
* Optional ability to route radio audio into recording path
* UI should show frequency, band, station/service name where available, and signal condition

Radio mode goals:

* Dedicated hardware access button or mode state
* Display should clearly indicate active radio mode
* Radio tuning should be tactile and visible
* Device should feel like a real radio-capable object, not just a media player with a hidden radio module

====================================================================
13. STORAGE SUBSYSTEM
=====================

Primary storage medium:

* microSD

Potential secondary storage option:

* USB storage (future/prototype option)

Storage roles:

* OS / system storage
* local playback library
* recording destination
* settings / logs

File strategy:

* Offline-first local file library
* Avoid forced streaming dependence
* Direct support for lossless and practical hi-res formats

====================================================================
14. POWER SUBSYSTEM
===================

Two product directions have been discussed:

14.1 Desktop / first hardware path

* External power
* Simpler prototype path
* Lower engineering and compliance complexity

14.2 Portable path

* Internal battery system
* Portable speaker/amp support in more advanced version
* Greater complexity but stronger product identity

Portable power considerations discussed:

* Pi 4 requires stable 5.1V-class supply and adequate current headroom
* Battery subsystem must be engineered for predictable current delivery
* Separate handling for compute power and speaker amp power may be needed

Power goals:

* Stable audio operation
* No random brown-outs or audio artefacts
* Clean supply strategy to reduce noise in audio path


MIT License

Copyright (c) 2026 Pezhman Farhangi
I/US Music

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Trademark and Brand Notice

“IUS” and “I/US Music®” are proprietary brand identifiers of I/US Music®.

The source code in this repository is licensed separately under the MIT License.
That license does not grant any right to use the IUS name, the I/US Music®
name, official logos, visual identity, artwork, images, music, or other brand
assets included in or referenced by this repository.

All such rights are reserved. Any use of protected brand features requires
prior written permission from I/US Music®.


index.html
README.txt
FOLDER_STRUCTURE.txt
HOSTING_NOTES.txt
css
  animations.css
  controls.css
  device.css
  displays.css
js
  eq.js
  knobs.js
  main.js
  player.js
  radio.js
assets
  images
    ius-official-logo.png
