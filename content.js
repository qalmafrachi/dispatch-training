// Dispatch Desk starter content.
// CCNA reactive calls only: no installs, no PMs, no creamer / Sure Shot / AC30 work, no other accounts.
// Jobs come from the Service Fusion Dispatch Map emails (admin@freeflowbev.com, 10/16/26 to 10/27/26)
// and Coke emails to dispatch@. Shifts and home bases are from Qais's roster (Oct 2026). Drive times are approximate.
// Ratings: best = Pro move, good = Good move, ok = Safe move, miss = Costly move (the trap). Options are shuffled in the app.
window.TRAINING_CONTENT = {
 "cycles": [
  {
   "id": 1,
   "title": "Protect the clock",
   "blurb": "How CT<12, FRFV and CT>36 work, and why calls that can still make 12 hours always go first.",
   "sessions": [
    {
     "key": "c1-w1-tue",
     "week": 1,
     "day": "tue",
     "kind": "lesson",
     "title": "Every call has a clock",
     "minutes": 10,
     "slides": [
      {
       "kind": "cover",
       "title": "Every call has a clock",
       "sub": "Today you'll learn the one rule that decides the order of every board, and why it works.",
       "narration": "Every call has a clock. Today you'll learn the one rule that decides the order of every board, and why it works."
      },
      {
       "kind": "metrics",
       "title": "The three clocks Coke watches",
       "items": [
        {
         "name": "CT<12",
         "target": "73%",
         "means": "Call completed within 12 hours of when it came in.",
         "dispatch": "Board order, full boards, fast routing of new calls."
        },
        {
         "name": "FRFV",
         "target": "90% / 93%",
         "means": "Fixed on the first visit. 90% CCFS, 93% Legacy.",
         "dispatch": "Right info on the call, right parts, right tech."
        },
        {
         "name": "CT>36",
         "target": "Under 7%",
         "means": "Calls that take longer than 36 hours.",
         "dispatch": "Parts sweep, not letting old calls drift."
        }
       ],
       "narration": "Coke grades us on three clocks. CT under 12: was the call finished within twelve hours? Target seventy three percent. FRFV: was it fixed on the first visit? CT over 36: how many calls dragged past a day and a half? Dispatch touches all three, and CT under 12 most of all."
      },
      {
       "kind": "list",
       "title": "What the 12-hour clock means",
       "items": [
        "The clock starts the minute a call comes in, not when we schedule it.",
        "If the call is completed within 12 hours, it counts as a pass for CT<12.",
        "At 12 hours and 1 minute, it's a miss. Finishing at hour 13 or hour 30 counts the same: missed.",
        "So once a call has missed 12 hours, a few more hours don't change that score. A call that can still make it does."
       ],
       "narration": "What the 12-hour clock means. The clock starts the minute a call comes in, not when we schedule it. If the call is completed within 12 hours, it counts as a pass for CT<12. At 12 hours and 1 minute, it's a miss. Finishing at hour 13 or hour 30 counts the same: missed. So once a call has missed 12 hours, a few more hours don't change that score. A call that can still make it does."
      },
      {
       "kind": "list",
       "title": "So who goes first?",
       "items": [
        "First: calls that can still make 12 hours. The closest deadline goes first.",
        "Second: calls already past 12 hours that are getting close to 36 hours.",
        "Third: older calls that are nowhere near 36. They still get done today, they just fill in around the others.",
        "Getting to fresh calls early also helps first-time fixes: the tech isn't rushing at the end of the day."
       ],
       "narration": "So who goes first?. First: calls that can still make 12 hours. The closest deadline goes first. Second: calls already past 12 hours that are getting close to 36 hours. Third: older calls that are nowhere near 36. They still get done today, they just fill in around the others. Getting to fresh calls early also helps first-time fixes: the tech isn't rushing at the end of the day."
      },
      {
       "kind": "think",
       "title": "You decide: two calls, one tech",
       "facts": [
        "Mark has time for one more call before he goes home.",
        "Call A came in yesterday afternoon. It already missed 12 hours.",
        "Call B came in at 7:00 this morning. Its 12-hour clock ends at 7:00 tonight."
       ],
       "question": "Which call does Mark take first?",
       "answer": "Call B, the fresh one.",
       "why": "Call A already missed its 12 hours. Doing it now or tomorrow morning doesn't change that. Call B can still pass, but only if Mark goes now. Call A goes first thing tomorrow, before it gets near 36 hours.",
       "narration": "You decide: two calls, one tech. Mark has time for one more call before he goes home. Call A came in yesterday afternoon. It already missed 12 hours. Call B came in at 7:00 this morning. Its 12-hour clock ends at 7:00 tonight. Which call does Mark take first? Think about it, then tap to see the answer."
      },
      {
       "kind": "think",
       "title": "Real call: Meriden, Tue 10/27",
       "facts": [
        "McDonald's #23601 in Meriden came in at 6:57 AM. The 12-hour clock ends at 6:57 PM.",
        "Pexton starts at 10:00 AM in Hartford, 20 minutes away, with no other CCNA reactive calls yet.",
        "Holt starts at 2:00 PM in Waterbury, also 20 minutes away, but already has Milford, Norwich and Hartford."
       ],
       "question": "Who takes Meriden, and where on his board?",
       "answer": "Pexton, as his first stop at 10:00 AM.",
       "why": "He gets there 3 hours after the call came in, with 9 hours of buffer. Holt would also make it, but it squeezes a night that's already full.",
       "narration": "Real call: Meriden, Tue 10/27. McDonald's #23601 in Meriden came in at 6:57 AM. The 12-hour clock ends at 6:57 PM. Pexton starts at 10:00 AM in Hartford, 20 minutes away, with no other CCNA reactive calls yet. Holt starts at 2:00 PM in Waterbury, also 20 minutes away, but already has Milford, Norwich and Hartford. Who takes Meriden, and where on his board? Think about it, then tap to see the answer."
      },
      {
       "kind": "think",
       "title": "Real call: Springfield, Mon 10/26",
       "facts": [
        "McDonald's #592 in Springfield came in at 4:49 PM. The clock ends at 4:49 AM.",
        "Humam lives 15 minutes away but clocked out at 4:30.",
        "Holt is the Monday night tech, on his first of 5 calls in Bellingham, MA.",
        "Mark is finishing his last call in Enfield, 20 minutes away. He works until 6:30."
       ],
       "question": "Can this clock be saved? By whom?",
       "answer": "Yes. Mark, tonight, as his last stop.",
       "why": "It's easy to look only at the night tech and decide the call can't make it. Always check every tech still on shift. Mark had 90 minutes and nothing else waiting. On the real day it went to Mark the next morning, and the clock was missed.",
       "narration": "Real call: Springfield, Mon 10/26. McDonald's #592 in Springfield came in at 4:49 PM. The clock ends at 4:49 AM. Humam lives 15 minutes away but clocked out at 4:30. Holt is the Monday night tech, on his first of 5 calls in Bellingham, MA. Mark is finishing his last call in Enfield, 20 minutes away. He works until 6:30. Can this clock be saved? By whom? Think about it, then tap to see the answer."
      },
      {
       "kind": "mission",
       "title": "Your mission this week",
       "text": "Every morning, before you build boards, sort the calls into three groups: can still make 12, close to 36, and the rest. Build the boards in that order.",
       "narration": "Your mission this week. Every morning, before you build boards, sort the calls into three groups: can still make 12, close to 36, and the rest. Build the boards in that order."
      }
     ]
    },
    {
     "key": "c1-w1-fri",
     "week": 1,
     "day": "fri",
     "kind": "play",
     "title": "Who takes it? Real calls",
     "minutes": 12,
     "activities": [
      {
       "kind": "map",
       "id": "c1-map",
       "title": "Who takes it?",
       "intro": "Real CCNA calls on the map. Read each tech's day: what they're on, how many calls are left, and when they clock out. The closest pin is often the trap. One choice on every call is a costly move.",
       "rounds": [
        {
         "id": "winchendon",
         "when": "Fri 10/23, 7:00 AM Dispatch Map",
         "call": {
          "wo": "541463",
          "store": "McDonald's #12061",
          "town": "Winchendon, MA",
          "address": "235 Spring St, Winchendon, MA",
          "created": "Thu 10/22 9:25 PM",
          "clockEnds": "9:25 AM today",
          "status": "Unscheduled, High. Third call at this store since 10/19"
         },
         "prompt": "Who takes Winchendon, and when?",
         "options": [
          {
           "name": "Louis",
           "town": "Fitchburg, MA",
           "plan": "First stop, before Northampton",
           "now": "Not started. Works weekday mornings",
           "board": "3 calls: Northampton #862, Watertown CT #3534, Enfield #2070 (redispatched)",
           "shift": "Weekday mornings",
           "distance": "About 25 minutes from home",
           "rating": "best",
           "why": "He's 25 minutes away and his day heads west anyway. First stop gives the 9:25 AM clock a real chance."
          },
          {
           "name": "Louis",
           "town": "Fitchburg, MA",
           "plan": "After Northampton",
           "now": "Not started",
           "board": "3 calls: Northampton, Watertown CT, Enfield",
           "shift": "Weekday mornings",
           "distance": "Northampton is an hour west, then an hour back",
           "rating": "ok",
           "why": "Right tech. But Northampton first sends him an hour west and an hour back east."
          },
          {
           "name": "Antwaune",
           "town": "Henniker, NH",
           "plan": "First stop, then his New Hampshire calls",
           "now": "Starts 8:00 AM",
           "board": "2 calls in New Hampshire",
           "shift": "8:00 AM-4:30 PM",
           "distance": "About an hour",
           "rating": "good",
           "why": "He could arrive close to 9:25. It works, just tighter than Louis."
          },
          {
           "name": "Phil",
           "town": "Westborough, MA",
           "plan": "First stop of his night",
           "now": "Starts 2:00 PM",
           "board": "1 call: Blackstone Valley 14 Cinema, Millbury",
           "shift": "2:00-10:30 PM",
           "distance": "About an hour",
           "rating": "miss",
           "why": "Phil's night is light, so he's tempting. But he starts at 2 PM, almost 5 hours after the 9:25 AM clock runs out."
          }
         ],
         "lesson": "Phil starts at 2 PM, long after the 9:25 AM clock. On the real day, Humam drove up from Westfield and fixed it. This store also had calls on 10/19 and 10/22: whoever goes should get the notes from those visits."
        },
        {
         "id": "springfield-592",
         "when": "Mon 10/26, 5:00 PM Dispatch Map",
         "call": {
          "wo": "541534",
          "store": "McDonald's #592",
          "town": "Springfield, MA",
          "address": "809 Boston Rd, Springfield, MA",
          "created": "Mon 10/26 4:49 PM",
          "clockEnds": "4:49 AM Tuesday",
          "status": "Unscheduled, High. Fixed here on 10/22 (WO 541441)"
         },
         "prompt": "Who takes Springfield #592?",
         "options": [
          {
           "name": "Mark",
           "town": "Enfield, CT",
           "plan": "Last stop tonight",
           "now": "Finishing McDonald's #2070 in Enfield, his last call",
           "board": "Nothing after Enfield",
           "shift": "Until 6:30 PM",
           "distance": "About 20 minutes",
           "rating": "best",
           "why": "On the clock, 20 minutes away, nothing else waiting. That's a saved clock."
          },
          {
           "name": "Mark",
           "town": "Enfield, CT",
           "plan": "First stop tomorrow at 10:00 AM",
           "now": "Finishing in Enfield",
           "board": "Nothing after Enfield",
           "shift": "Until 6:30 PM",
           "distance": "About 20 minutes",
           "rating": "good",
           "why": "Scheduled and first stop, so it won't drift."
          },
          {
           "name": "Humam",
           "town": "Westfield, MA",
           "plan": "Call him back out tonight",
           "now": "Clocked out at 4:30 PM",
           "board": "Done for the day",
           "shift": "Off",
           "distance": "Lives about 15 minutes away",
           "rating": "miss",
           "why": "He's the closest pin and he fixed this store on 10/22. But he's off: calling him back is overtime, which needs Qais, and Mark is still on the clock 20 minutes away."
          },
          {
           "name": "Holt",
           "town": "Bellingham, MA",
           "plan": "Add it to his night",
           "now": "On the way to Chili's in Bellingham, call 1 of 5",
           "board": "Hopkinton, Marlborough, Milford CT, Naugatuck CT after",
           "shift": "Until 10:30 PM",
           "distance": "About 1 hour 20 minutes",
           "rating": "ok",
           "why": "He's on all night, which is the right instinct."
          }
         ],
         "lesson": "Calling Humam back out is overtime, which needs Qais first, and Mark is already on the clock nearby. Holt's five calls across two states already fill his night. And this machine was fixed 4 days earlier: send that visit's notes with Mark."
        },
        {
         "id": "milford-7461",
         "when": "Sat 10/24, 5:00 PM Dispatch Map",
         "call": {
          "wo": "541489",
          "store": "McDonald's #7461",
          "town": "Milford, CT",
          "address": "I-95 between exits 40 and 41, Milford, CT",
          "created": "Sat 10/24 1:42 AM",
          "clockEnds": "Missed. 36 hours hits Sun 1:42 PM",
          "status": "On Pexton's board, not started"
         },
         "prompt": "It's 5:00 PM Saturday. Who saves the 36-hour clock?",
         "options": [
          {
           "name": "Pexton",
           "town": "New Haven, CT",
           "plan": "Keep it on his board",
           "now": "Working McDonald's #6744 in New Haven, call 1 of 5 still open",
           "board": "Milford, Westport, Groton, North Haven (parts needed) still waiting",
           "shift": "Until 6:30 PM",
           "distance": "About 15 minutes",
           "rating": "ok",
           "why": "He's the closest, so it's a natural first thought."
          },
          {
           "name": "Phil",
           "town": "East Lyme, CT",
           "plan": "Tonight, after Branford",
           "now": "Working McDonald's #32967 in East Lyme, call 1 of 3",
           "board": "Branford #1351, Torrington #17764",
           "shift": "Until 10:30 PM",
           "distance": "Branford to Milford is about 25 minutes",
           "rating": "best",
           "why": "Phil is on until 10:30 and already heading to Branford. Milford gets done Saturday night, before the 36-hour mark. Move Torrington to Louis to make room."
          },
          {
           "name": "Louis",
           "town": "Watertown, CT",
           "plan": "After Watertown",
           "now": "On the way to McDonald's #3534 in Watertown",
           "board": "Holyoke #1213 (redispatched) after",
           "shift": "Weekend coverage, check his hours",
           "distance": "About 35 minutes",
           "rating": "good",
           "why": "Close and light. It works if he's still on, so check his hours first."
          },
          {
           "name": "Holt",
           "town": "Waterbury, CT",
           "plan": "Sunday at 2:00 PM",
           "now": "Off on Saturdays",
           "board": "Sunday: Hartford #6882, Meriden #739",
           "shift": "Sunday 2:00-10:30 PM",
           "distance": "About 30 minutes",
           "rating": "miss",
           "why": "Holt does cover Sunday, but 2 PM is after the 36-hour mark at 1:42 PM. That's what really happened, and the call crossed 36 hours."
          }
         ],
         "lesson": "Pexton has 90 minutes left and four calls ahead of Milford. Sunday at 2 PM is past the 36-hour mark, and that's what really happened: the call moved to Holt for Sunday afternoon."
        }
       ]
      },
      {
       "kind": "scenarios",
       "id": "c1-w1-scen",
       "title": "Pick the move",
       "items": [
        {
         "id": "meriden",
         "when": "Tue 10/27, 7:00 AM Dispatch Map",
         "ticket": {
          "wo": "541547",
          "store": "McDonald's #23601",
          "address": "533 S Broad St, Meriden, CT",
          "created": "Tue 10/27 6:57 AM",
          "clockEnds": "6:57 PM",
          "status": "Unscheduled, High"
         },
         "context": [
          "Pexton (Hartford, 10:00 AM-6:30 PM): no CCNA reactive calls on his board yet. About 20 minutes from Meriden.",
          "Holt (Waterbury, 2:00-10:30 PM): Milford #7461 (second call at that store in 3 days), Norwich #4015, Hartford #6882 (redispatched since 10/22). About 20 minutes from Meriden.",
          "Mark (Windsor Locks, 10:00 AM-6:30 PM): Springfield #26537 (repeat from Monday) and Springfield #592 (came in Mon 4:49 PM, 12-hour clock already gone)."
         ],
         "prompt": "Where does Meriden go, and where on that board?",
         "options": [
          {
           "label": "Pexton, first stop at 10:00. Then move Hartford #6882 off Holt's night onto Pexton's afternoon.",
           "rating": "best",
           "why": "Saves the 12-hour clock with 8 hours to spare, and fixes the call that keeps sliding on Holt's nights. Two problems, one board.",
           "better": []
          },
          {
           "label": "Pexton, first stop at 10:00. Leave Holt's night as it is so he has room for new calls.",
           "rating": "good",
           "why": "Clock saved, and with plenty of buffer.",
           "better": [
            "Hartford #6882 has been redispatched on Holt's nights since 10/22. Pexton lives in Hartford and now has room.",
            "When you're already rebuilding a board, fix the call that keeps sliding too."
           ]
          },
          {
           "label": "Holt, first stop at 2:00 PM. Pexton stays free in case a Hartford call comes in.",
           "rating": "ok",
           "why": "It still makes the 12-hour mark, so the clock is saved.",
           "better": [
            "Holt's night already runs from Milford to Norwich to Hartford. Adding Meriden squeezes the repeat call at Milford.",
            "Pexton is free right now. A tech held back 'in case' is a tech doing nothing."
           ]
          },
          {
           "label": "Mark, after Springfield. He'll be heading south anyway and can be there mid-afternoon.",
           "rating": "miss",
           "why": "It looks efficient on the map.",
           "better": [
            "Two Springfield calls, one of them a repeat, can easily run to 3 PM or later. Then it's 45 minutes to Meriden, and the 6:57 PM clock is at risk.",
            "Pexton is 20 minutes away at 10:00 with nothing on his board."
           ]
          }
         ]
        },
        {
         "id": "devin-louis",
         "when": "Tue 10/27, 7:00 AM Dispatch Map",
         "context": [
          "Louis (Fitchburg, weekday days): one call, McDonald's #1213 in Holyoke (redispatched).",
          "Mark: two Springfield McDonald's calls, #26537 and #592.",
          "Devin (8:00 AM-4:30 PM, also covers dispatch): NE Laborers Training in Hopkinton (on the way), two calls at McDonald's #2116 in Ware, McDonald's #11540 in Springfield, McDonald's #12009 in Palmer (redispatched).",
          "Holyoke to Palmer is about 35 minutes. Palmer to Ware is about 20. Hopkinton to Ware is about an hour."
         ],
         "prompt": "How do you rebalance this?",
         "options": [
          {
           "label": "Springfield #11540 to Mark. Palmer and both Ware calls to Louis after Holyoke. Devin keeps Hopkinton.",
           "rating": "best",
           "why": "One tech per city, Louis gets a real day on a tight loop, and Devin gets the afternoon back for dispatch.",
           "better": []
          },
          {
           "label": "Springfield #11540 and Palmer to Louis after Holyoke. Devin keeps Hopkinton and Ware.",
           "rating": "good",
           "why": "Louis gets a full day and Devin gets lighter. Real improvement.",
           "better": [
            "Mark is already in Springfield with two calls. #11540 costs him minutes, not an hour.",
            "That frees Louis for the Ware pair, which sits right past Palmer."
           ]
          },
          {
           "label": "Palmer to Louis. Springfield stays with Devin, since he'll pass through on the way home.",
           "rating": "ok",
           "why": "Moving the redispatched Palmer call is smart.",
           "better": [
            "Devin is the one person who also runs dispatch. Every call you leave him is time off the board.",
            "Mark is already in Springfield."
           ]
          },
          {
           "label": "Split the Ware calls: one to Louis, one stays with Devin so both of them pass through.",
           "rating": "miss",
           "why": "Spreading the load feels fair.",
           "better": [
            "Two trucks to one store wastes a trip and splits the story of what's wrong there.",
            "Calls at the same store stay together on one tech."
           ]
          }
         ]
        }
       ]
      }
     ]
    },
    {
     "key": "c1-w2-tue",
     "week": 2,
     "day": "tue",
     "kind": "lesson",
     "title": "Calls that keep sliding",
     "minutes": 10,
     "slides": [
      {
       "kind": "cover",
       "title": "Calls that keep sliding",
       "sub": "Some calls get moved to tomorrow again and again. Today you'll learn how to spot them and what to change.",
       "narration": "Calls that keep sliding. Some calls get moved to tomorrow again and again. Today you'll learn how to spot them and what to change."
      },
      {
       "kind": "list",
       "title": "Why calls slide",
       "items": [
        "The call stays on the same tech's board, and he never gets to it.",
        "The next tech doesn't get the last tech's notes, so he starts from zero.",
        "Nobody changes the plan. The call just gets redispatched again.",
        "Every slide is another day toward 36 hours, and another visit against FRFV."
       ],
       "narration": "Why calls slide. The call stays on the same tech's board, and he never gets to it. The next tech doesn't get the last tech's notes, so he starts from zero. Nobody changes the plan. The call just gets redispatched again. Every slide is another day toward 36 hours, and another visit against FRFV."
      },
      {
       "kind": "think",
       "title": "Real call: Hartford #6882",
       "facts": [
        "It was redispatched on Holt's night shift on 10/22, again on 10/25, and again on 10/27.",
        "Pexton lives in Hartford and starts at 10:00 AM.",
        "On 10/27 Pexton had no other CCNA reactive calls on his board."
       ],
       "question": "What should change?",
       "answer": "Move it to Pexton as a morning stop, and ask Holt what stopped him before Pexton goes.",
       "why": "The same plan three times gives the same result. A different tech, at a different time of day, with the notes from the last visits, is a new plan.",
       "narration": "Real call: Hartford #6882. It was redispatched on Holt's night shift on 10/22, again on 10/25, and again on 10/27. Pexton lives in Hartford and starts at 10:00 AM. On 10/27 Pexton had no other CCNA reactive calls on his board. What should change? Think about it, then tap to see the answer."
      },
      {
       "kind": "think",
       "title": "Real call: a repeat at Springfield #26537",
       "facts": [
        "Bobby completed a call at this store on Monday 10/26.",
        "On Tuesday morning a new call came in at the same store and went to Mark."
       ],
       "question": "What do you do before Mark drives there?",
       "answer": "Send Mark what Bobby found and what he replaced, and make sure Mark has the parts.",
       "why": "A repeat within a day means something was missed or a part failed. If Mark starts from Bobby's notes, he can fix it the first time instead of repeating Bobby's visit.",
       "narration": "Real call: a repeat at Springfield #26537. Bobby completed a call at this store on Monday 10/26. On Tuesday morning a new call came in at the same store and went to Mark. What do you do before Mark drives there? Think about it, then tap to see the answer."
      },
      {
       "kind": "think",
       "title": "Real call: New Haven #6744",
       "facts": [
        "The call came in Friday 10/16 at 9:29 PM, after the night shift was winding down.",
        "On Saturday morning it was still unscheduled. Pexton was the only Connecticut day tech, and it wasn't on his board.",
        "It was finally started on Saturday 10/24, 8 days later."
       ],
       "question": "What was the moment to catch it?",
       "answer": "Saturday at 7:00 AM: put it on the weekend tech's board first thing.",
       "why": "If a weekend call isn't on a weekend board by Saturday morning, it waits until Monday at best. That's how 1 day becomes 8.",
       "narration": "Real call: New Haven #6744. The call came in Friday 10/16 at 9:29 PM, after the night shift was winding down. On Saturday morning it was still unscheduled. Pexton was the only Connecticut day tech, and it wasn't on his board. It was finally started on Saturday 10/24, 8 days later. What was the moment to catch it? Think about it, then tap to see the answer."
      },
      {
       "kind": "steps",
       "title": "Your check for any redispatched call",
       "steps": [
        {
         "h": "How many times has it been redispatched?",
         "p": "Once can happen. Twice means the plan needs to change."
        },
        {
         "h": "Why didn't the last visit finish it?",
         "p": "Ask the tech: no time, no part, or couldn't fix it?"
        },
        {
         "h": "Change one thing",
         "p": "A different tech, a different time of day, the part lined up, or help from Phil."
        },
        {
         "h": "Send the history with the call",
         "p": "The last tech's notes go to the next tech, every time."
        }
       ],
       "narration": "Your check for any redispatched call. How many times has it been redispatched?. Once can happen. Twice means the plan needs to change. Why didn't the last visit finish it?. Ask the tech: no time, no part, or couldn't fix it? Change one thing. A different tech, a different time of day, the part lined up, or help from Phil. Send the history with the call. The last tech's notes go to the next tech, every time."
      },
      {
       "kind": "mission",
       "title": "Your mission this week",
       "text": "Every morning, find one call that has been redispatched more than once. Find out why, and change the plan.",
       "narration": "Your mission this week. Every morning, find one call that has been redispatched more than once. Find out why, and change the plan."
      }
     ]
    },
    {
     "key": "c1-w2-fri",
     "week": 2,
     "day": "fri",
     "kind": "play",
     "title": "Fix the board: three techs",
     "minutes": 15,
     "activities": [
      {
       "kind": "board",
       "id": "c1-board-1024",
       "title": "Fix the board",
       "when": "Sat 10/24, 5:00 PM Dispatch Map",
       "intro": "Saturday at 5:00 PM, the real board (CCNA calls only). Three techs are working. One call is about to cross 36 hours and a new one can still make 12. Tap a job, then tap the tech you want to give it to, then check your board.",
       "lanes": [
        {
         "id": "pexton",
         "name": "Pexton",
         "info": "Hartford, CT. Until 6:30 PM. Now in New Haven"
        },
        {
         "id": "phil",
         "name": "Phil",
         "info": "Westborough, MA. Until 10:30 PM. Now in East Lyme"
        },
        {
         "id": "louis",
         "name": "Louis",
         "info": "Weekend coverage. Heading to Watertown"
        },
        {
         "id": "unscheduled",
         "name": "Unscheduled",
         "info": "Nobody owns these yet"
        }
       ],
       "jobs": [
        {
         "id": "541339",
         "lane": "pexton",
         "store": "McDonald's #6744",
         "town": "New Haven, CT",
         "note": "Started"
        },
        {
         "id": "541489",
         "lane": "pexton",
         "store": "McDonald's #7461",
         "town": "Milford, CT",
         "note": "Came in 1:42 AM. 36 hours: Sun 1:42 PM"
        },
        {
         "id": "541469",
         "lane": "pexton",
         "store": "McDonald's #16332",
         "town": "Westport, CT",
         "note": ""
        },
        {
         "id": "540899",
         "lane": "pexton",
         "store": "McDonald's #1223",
         "town": "Groton, CT",
         "note": "Redispatched"
        },
        {
         "id": "541346",
         "lane": "pexton",
         "store": "McDonald's #10877",
         "town": "North Haven, CT",
         "note": "Parts needed"
        },
        {
         "id": "541491",
         "lane": "phil",
         "store": "McDonald's #32967",
         "town": "East Lyme, CT",
         "note": "Started"
        },
        {
         "id": "541484",
         "lane": "phil",
         "store": "McDonald's #1351",
         "town": "Branford, CT",
         "note": ""
        },
        {
         "id": "541492",
         "lane": "phil",
         "store": "McDonald's #17764",
         "town": "Torrington, CT",
         "note": ""
        },
        {
         "id": "541478",
         "lane": "louis",
         "store": "McDonald's #3534",
         "town": "Watertown, CT",
         "note": "On the way"
        },
        {
         "id": "541149",
         "lane": "louis",
         "store": "McDonald's #1213",
         "town": "Holyoke, MA",
         "note": "Redispatched"
        },
        {
         "id": "541493",
         "lane": "unscheduled",
         "store": "McDonald's #27001",
         "town": "Derby, CT",
         "note": "Came in 3:21 PM, High"
        }
       ],
       "goals": [
        {
         "id": "milford",
         "title": "Milford beats the 36-hour mark",
         "hint": "Milford hits 36 hours Sunday at 1:42 PM, and Holt doesn't start until 2:00 PM Sunday. Pexton has 90 minutes left and four calls ahead of it. Phil passes Branford, 25 minutes away, tonight.",
         "points": 25,
         "test": {
          "job": "541489",
          "lanes": [
           "phil"
          ]
         }
        },
        {
         "id": "derby",
         "title": "Derby lands on a Saturday night shift",
         "hint": "Derby can still make 12 hours (3:21 AM). Phil works until 10:30, and Branford is about 30 minutes from Derby.",
         "points": 25,
         "test": {
          "job": "541493",
          "lanes": [
           "phil"
          ]
         }
        },
        {
         "id": "torrington",
         "title": "Louis takes Torrington",
         "hint": "Louis is in Watertown, about 20 minutes from Torrington. That keeps Phil on the shoreline for Milford and Derby.",
         "points": 20,
         "test": {
          "job": "541492",
          "lanes": [
           "louis"
          ]
         }
        },
        {
         "id": "pexton-real",
         "title": "Pexton's board is something he can finish",
         "hint": "At 5:00 PM with 90 minutes left, Pexton can't finish five calls. Keep New Haven and what fits; move what Phil or Louis can reach tonight.",
         "points": 15,
         "test": {
          "maxJobs": {
           "lane": "pexton",
           "n": 3
          }
         }
        },
        {
         "id": "zero",
         "title": "Zero unscheduled",
         "hint": "Every call has an owner.",
         "points": 5,
         "test": {
          "emptyLane": "unscheduled"
         }
        }
       ]
      },
      {
       "kind": "scenarios",
       "id": "c1-w2-scen",
       "title": "Pick the move",
       "items": [
        {
         "id": "phil-order",
         "when": "Sat 10/24, 5:00 PM Dispatch Map",
         "context": [
          "Phil (on until 10:30 PM) is working McDonald's #32967 in East Lyme.",
          "Still on his night: McDonald's #1351 Branford, plus two calls you just moved to him: Milford #7461 (came in 1:42 AM, past 12 hours, hits 36 hours Sun 1:42 PM) and Derby #27001 (came in 3:21 PM, 12-hour clock ends 3:21 AM).",
          "East Lyme to Branford: 30 min. Branford to Milford: 25 min. Milford to Derby: 15 min. East Lyme straight to Derby: 55 min."
         ],
         "prompt": "Phil probably fits three more calls tonight, maybe not four. What order?",
         "options": [
          {
           "label": "Derby first, then Milford, then Branford if time allows. Tell Branford it may be first stop tomorrow.",
           "rating": "best",
           "why": "Derby is the only call that can still make 12 hours, Milford is minutes away and beats 36 hours tonight, and Branford is the one that can safely slide.",
           "better": []
          },
          {
           "label": "Branford, Milford, then Derby. It's the straight line west along I-95.",
           "rating": "good",
           "why": "Clean route, and if Phil finishes all three, every clock is saved.",
           "better": [
            "If any call runs long, the one that slips is Derby, the only call with a live 12-hour clock.",
            "Put the clock you can still save first, and let the call with no clock left take the risk."
           ]
          },
          {
           "label": "Milford first since it's the oldest, then Derby, then Branford.",
           "rating": "ok",
           "why": "Protecting the 36-hour mark is the right instinct.",
           "better": [
            "Milford's 36-hour mark isn't until tomorrow afternoon. Derby's 12-hour clock runs out tonight.",
            "Calls that can still make 12 hours go first. Then the ones near 36."
           ]
          },
          {
           "label": "Branford first because it was on his board first, then whatever fits.",
           "rating": "miss",
           "why": "Respecting the original plan feels orderly.",
           "better": [
            "Board order is set by clocks, not by who got there first.",
            "This order puts both rescued calls at the end of the night, where they're the first to slip."
           ]
          }
         ]
        },
        {
         "id": "repeat-26537",
         "when": "Tue 10/27, 7:00 AM Dispatch Map",
         "ticket": {
          "wo": "541538",
          "store": "McDonald's #26537",
          "address": "660 Liberty St, Springfield, MA",
          "created": "Tue 10/27",
          "clockEnds": "12 hours after it came in",
          "status": "Dispatched to Mark"
         },
         "context": [
          "Bobby completed WO 541500 at this same store on Monday 10/26.",
          "Mark also has Springfield #592 today, which already missed its 12-hour clock."
         ],
         "prompt": "What do you do before Mark rolls?",
         "options": [
          {
           "label": "Get Bobby's notes and parts used to Mark, make #26537 his first stop, and flag it as a repeat.",
           "rating": "best",
           "why": "The live 12-hour clock goes first, and Mark walks in knowing what was already tried. That's how a repeat becomes a first-time fix.",
           "better": []
          },
          {
           "label": "Get Bobby's notes to Mark and let him choose the order of his two Springfield calls.",
           "rating": "good",
           "why": "The notes are the most important part, so this protects FRFV.",
           "better": [
            "Don't hand the board order to the tech. #26537 still has a 12-hour clock; #592 doesn't.",
            "Set the order, then send the notes."
           ]
          },
          {
           "label": "Send Bobby back, since he knows the machine.",
           "rating": "ok",
           "why": "Sending the tech who knows the history is reasonable.",
           "better": [
            "Bobby is based in Glens Falls, NY. Mark is already in Springfield today.",
            "Moving the notes is faster than moving the tech."
           ]
          },
          {
           "label": "Make #592 first since it came in first and is already late.",
           "rating": "miss",
           "why": "Going oldest-first feels fair to the store that waited longest.",
           "better": [
            "#592's 12-hour clock is already gone. #26537's isn't.",
            "Late calls still get done today, just after the clock you can still save."
           ]
          }
         ]
        },
        {
         "id": "carmel",
         "when": "Thu 10/22",
         "ticket": {
          "wo": "541366 and 541384",
          "store": "McDonald's #2121",
          "address": "1931 Route 6, Carmel, NY",
          "created": "On the board by 10/20",
          "clockEnds": "Past 2 days",
          "status": "Still open, redispatched"
         },
         "context": [
          "Both calls have been open since at least 10/20. The tech says a part is on order."
         ],
         "prompt": "What should already have happened by today?",
         "options": [
          {
           "label": "An email to Joel and Kendrick with the reason (part on order), and when the part is expected.",
           "rating": "best",
           "why": "Exactly what Coke asked for, with timing they can pass on.",
           "better": []
          },
          {
           "label": "An email to Joel and Kendrick saying both calls are waiting on a part.",
           "rating": "good",
           "why": "Proactive, which is the main thing.",
           "better": [
            "Add when the part is expected. Without a date, Coke writes back to ask."
           ]
          },
          {
           "label": "Update the plan in all systems. Coke gets the update when it's fixed.",
           "rating": "ok",
           "why": "Keeping the systems current is real service.",
           "better": [
            "Coke specifically asked for the 2-day email. Updated systems are great, but they don't replace it."
           ]
          },
          {
           "label": "Nothing yet. Both calls are on the board and will show as fixed soon.",
           "rating": "miss",
           "why": "The calls are covered, so it feels handled.",
           "better": [
            "Coke asked to hear about any McDonald's call going past 2 days, before it's fixed.",
            "Bad news found on a report becomes a complaint."
           ]
          }
         ]
        }
       ]
      }
     ]
    }
   ]
  },
  {
   "id": 2,
   "title": "Full boards, smart routes",
   "blurb": "Fill every board, rebuild it when a call lands, and know who is on shift at 5 PM on a Saturday.",
   "sessions": [
    {
     "key": "c2-w1-tue",
     "week": 1,
     "day": "tue",
     "kind": "lesson",
     "title": "A full board wins the day",
     "minutes": 10,
     "slides": [
      {
       "kind": "cover",
       "title": "A full board wins the day",
       "sub": "Today you'll learn why every board should be full, and how to move calls so each tech's day makes sense.",
       "narration": "A full board wins the day. Today you'll learn why every board should be full, and how to move calls so each tech's day makes sense."
      },
      {
       "kind": "list",
       "title": "Why full boards matter",
       "items": [
        "If a tech finishes early with nothing next, those hours are gone. You can't get them back.",
        "If a tech has one call too many, the extra call just moves to tomorrow. Nothing is lost.",
        "So a board that's a little too full is always better than a board that's a little too empty.",
        "Calls in the same town go to the same tech, so nobody drives past another tech's job."
       ],
       "narration": "Why full boards matter. If a tech finishes early with nothing next, those hours are gone. You can't get them back. If a tech has one call too many, the extra call just moves to tomorrow. Nothing is lost. So a board that's a little too full is always better than a board that's a little too empty. Calls in the same town go to the same tech, so nobody drives past another tech's job."
      },
      {
       "kind": "columns",
       "title": "Tue 10/27, 7:00 AM: reactive calls by tech",
       "columns": [
        {
         "head": "Louis",
         "items": [
          "McDonald's #1213, Holyoke (redispatched)"
         ]
        },
        {
         "head": "Mark",
         "items": [
          "McDonald's #26537, Springfield",
          "McDonald's #592, Springfield"
         ]
        },
        {
         "head": "Ben",
         "items": [
          "Qdoba #1782, Hudson",
          "McDonald's #12061, Winchendon"
         ]
        },
        {
         "head": "Devin (also on dispatch)",
         "items": [
          "NE Laborers Training, Hopkinton",
          "McDonald's #2116, Ware (2 calls)",
          "McDonald's #11540, Springfield",
          "McDonald's #12009, Palmer (redispatched)"
         ]
        }
       ],
       "caption": "Louis had one reactive call. Devin, who also runs dispatch, had five, and one of them sat in the same city as Mark's two. The fix is right there on the board.",
       "narration": "Here are the reactive calls on Tuesday the twenty seventh at seven. Louis had one. Mark had two in Springfield. Ben had two, an hour apart. And Devin, who also covers dispatch, had five, including a third Springfield call. Light boards are a question. Heavy boards are where you take from first."
      },
      {
       "kind": "think",
       "title": "You decide: the Tuesday board",
       "facts": [
        "Louis had one call in Holyoke.",
        "Mark had two calls in Springfield.",
        "Devin had five calls, one of them in Springfield, and he also covers dispatch.",
        "Palmer and Ware (two calls at the same store) are 20 to 35 minutes from Holyoke."
       ],
       "question": "What do you move?",
       "answer": "Springfield #11540 to Mark. Palmer and both Ware calls to Louis. Devin keeps Hopkinton.",
       "why": "Now each city has one tech, Louis has a real day, and Devin gets his afternoon back for dispatch.",
       "narration": "You decide: the Tuesday board. Louis had one call in Holyoke. Mark had two calls in Springfield. Devin had five calls, one of them in Springfield, and he also covers dispatch. Palmer and Ware (two calls at the same store) are 20 to 35 minutes from Holyoke. What do you move? Think about it, then tap to see the answer."
      },
      {
       "kind": "steps",
       "title": "When a new call comes in, rebuild in four moves",
       "steps": [
        {
         "h": "Who can get there before the 12-hour mark?",
         "p": "Check everyone on shift, not just the closest tech."
        },
        {
         "h": "Who has room, or a call that someone else could take?",
         "p": "A light board, or a call you can move."
        },
        {
         "h": "Keep towns together",
         "p": "One tech per town whenever you can."
        },
        {
         "h": "Tell every tech whose day changed",
         "p": "Before they leave for the old plan."
        }
       ],
       "narration": "When a new call comes in, rebuild in four moves. Who can get there before the 12-hour mark?. Check everyone on shift, not just the closest tech. Who has room, or a call that someone else could take?. A light board, or a call you can move. Keep towns together. One tech per town whenever you can. Tell every tech whose day changed. Before they leave for the old plan."
      },
      {
       "kind": "list",
       "title": "Remember",
       "items": [
        "A too-full board loses nothing. An empty afternoon loses hours.",
        "One tech per town. Two calls at one store go to one tech.",
        "The tech who also does dispatch is the first board you lighten."
       ],
       "narration": "Remember. A too-full board loses nothing. An empty afternoon loses hours. One tech per town. Two calls at one store go to one tech. The tech who also does dispatch is the first board you lighten."
      },
      {
       "kind": "mission",
       "title": "Your mission this week",
       "text": "Every morning, find the lightest and the heaviest board, and move at least one call between them.",
       "narration": "Your mission this week. Every morning, find the lightest and the heaviest board, and move at least one call between them."
      }
     ]
    },
    {
     "key": "c2-w1-fri",
     "week": 1,
     "day": "fri",
     "kind": "play",
     "title": "Fix the board: six techs",
     "minutes": 15,
     "activities": [
      {
       "kind": "board",
       "id": "c2-board-1027",
       "title": "Fix the board",
       "when": "Tue 10/27, 7:00 AM Dispatch Map",
       "intro": "The real Tuesday 7:00 AM board, five techs, CCNA reactive calls only (other work is hidden, so some techs have more on their day). One new call is waiting, one tech is light, one is overloaded, and one city is split. Fix it, then check your board. The goals stay hidden until you check.",
       "lanes": [
        {
         "id": "mark",
         "name": "Mark",
         "info": "Windsor Locks, CT. 10:00 AM-6:30 PM"
        },
        {
         "id": "louis",
         "name": "Louis",
         "info": "Fitchburg, MA. Weekday mornings"
        },
        {
         "id": "pexton",
         "name": "Pexton",
         "info": "Hartford, CT. 10:00 AM-6:30 PM"
        },
        {
         "id": "holt",
         "name": "Holt",
         "info": "Waterbury, CT. 2:00-10:30 PM"
        },
        {
         "id": "devin",
         "name": "Devin",
         "info": "8:00 AM-4:30 PM. Also covers dispatch"
        },
        {
         "id": "unscheduled",
         "name": "Unscheduled",
         "info": "Nobody owns these yet"
        }
       ],
       "jobs": [
        {
         "id": "541538",
         "lane": "mark",
         "store": "McDonald's #26537",
         "town": "Springfield, MA",
         "note": "Repeat: Bobby was here 10/26"
        },
        {
         "id": "541534",
         "lane": "mark",
         "store": "McDonald's #592",
         "town": "Springfield, MA",
         "note": "Came in Mon 4:49 PM"
        },
        {
         "id": "541149",
         "lane": "louis",
         "store": "McDonald's #1213",
         "town": "Holyoke, MA",
         "note": "Redispatched"
        },
        {
         "id": "541530",
         "lane": "holt",
         "store": "McDonald's #7461",
         "town": "Milford, CT",
         "note": ""
        },
        {
         "id": "541537",
         "lane": "holt",
         "store": "McDonald's #4015",
         "town": "Norwich, CT",
         "note": ""
        },
        {
         "id": "541371",
         "lane": "holt",
         "store": "McDonald's #6882",
         "town": "Hartford, CT",
         "note": "Redispatched since 10/22"
        },
        {
         "id": "541526",
         "lane": "devin",
         "store": "NE Laborers Training",
         "town": "Hopkinton, MA",
         "note": "On the way"
        },
        {
         "id": "541525",
         "lane": "devin",
         "store": "McDonald's #2116",
         "town": "Ware, MA",
         "note": "Call 1 of 2 at this store"
        },
        {
         "id": "541524",
         "lane": "devin",
         "store": "McDonald's #2116",
         "town": "Ware, MA",
         "note": "Call 2 of 2 at this store"
        },
        {
         "id": "541508",
         "lane": "devin",
         "store": "McDonald's #11540",
         "town": "Springfield, MA",
         "note": ""
        },
        {
         "id": "541505",
         "lane": "devin",
         "store": "McDonald's #12009",
         "town": "Palmer, MA",
         "note": "Redispatched"
        },
        {
         "id": "541547",
         "lane": "unscheduled",
         "store": "McDonald's #23601",
         "town": "Meriden, CT",
         "note": "Came in 6:57 AM, High"
        }
       ],
       "goals": [
        {
         "id": "meriden",
         "title": "Meriden goes to a tech who saves the clock",
         "hint": "Meriden came in at 6:57 AM. Pexton (10 AM, Hartford) or Holt (2 PM, Waterbury) both get there before 6:57 PM.",
         "points": 25,
         "test": {
          "job": "541547",
          "lanes": [
           "pexton",
           "holt"
          ]
         }
        },
        {
         "id": "springfield",
         "title": "All three Springfield calls are with one tech",
         "hint": "Mark has two Springfield calls and Devin has one. One tech, one city.",
         "points": 20,
         "test": {
          "together": [
           "541538",
           "541534",
           "541508"
          ]
         }
        },
        {
         "id": "louis",
         "title": "Louis gets a real day",
         "hint": "Louis has one call in Holyoke. Palmer is 35 minutes away and the two Ware calls are 20 minutes past that. Give him at least two more.",
         "points": 15,
         "test": {
          "minJobs": {
           "lane": "louis",
           "n": 3
          }
         }
        },
        {
         "id": "devin",
         "title": "Devin's board fits a dispatcher's day",
         "hint": "Devin has five calls and also covers dispatch. Bring him down to four or fewer.",
         "points": 15,
         "test": {
          "maxJobs": {
           "lane": "devin",
           "n": 4
          }
         }
        },
        {
         "id": "hartford",
         "title": "Hartford #6882 finally gets a new plan",
         "hint": "It's been redispatched on Holt's nights since 10/22. Pexton lives in Hartford and starts at 10 AM.",
         "points": 15,
         "test": {
          "job": "541371",
          "lanes": [
           "pexton"
          ]
         }
        },
        {
         "id": "zero",
         "title": "Zero unscheduled",
         "hint": "Every call has an owner.",
         "points": 10,
         "test": {
          "emptyLane": "unscheduled"
         }
        }
       ]
      },
      {
       "kind": "spot",
       "id": "c2-spot-1024",
       "title": "Spot the lazy choice",
       "when": "Sat 10/24, 7:00 AM Dispatch Map",
       "intro": "The real Saturday 7:00 AM board, CCNA calls only. Three things on it are the easy choice instead of the better move. Tap a job or a tech's name to call one out.",
       "lanes": [
        {
         "id": "louis",
         "name": "Louis",
         "info": "Weekend coverage"
        },
        {
         "id": "pexton",
         "name": "Pexton",
         "info": "Hartford, CT. 10:00 AM-6:30 PM"
        },
        {
         "id": "unscheduled",
         "name": "Unscheduled",
         "info": "Nobody owns these yet"
        }
       ],
       "jobs": [
        {
         "id": "541478",
         "lane": "louis",
         "store": "McDonald's #3534",
         "town": "Watertown, CT",
         "note": ""
        },
        {
         "id": "541484",
         "lane": "louis",
         "store": "McDonald's #1351",
         "town": "Branford, CT",
         "note": ""
        },
        {
         "id": "541149",
         "lane": "louis",
         "store": "McDonald's #1213",
         "town": "Holyoke, MA",
         "note": "Redispatched"
        },
        {
         "id": "540781",
         "lane": "louis",
         "store": "Clark Univ. Higgins Hall Bistro",
         "town": "Worcester, MA",
         "note": "Redispatched"
        },
        {
         "id": "541469",
         "lane": "pexton",
         "store": "McDonald's #16332",
         "town": "Westport, CT",
         "note": ""
        },
        {
         "id": "541339",
         "lane": "pexton",
         "store": "McDonald's #6744",
         "town": "New Haven, CT",
         "note": "Redispatched"
        },
        {
         "id": "541346",
         "lane": "pexton",
         "store": "McDonald's #10877",
         "town": "North Haven, CT",
         "note": "Redispatched"
        },
        {
         "id": "540899",
         "lane": "pexton",
         "store": "McDonald's #1223",
         "town": "Groton, CT",
         "note": "Redispatched"
        },
        {
         "id": "541489",
         "lane": "unscheduled",
         "store": "McDonald's #7461",
         "town": "Milford, CT",
         "note": "Came in 1:42 AM, High"
        }
       ],
       "problems": [
        {
         "id": "milford",
         "title": "Milford has no owner, and its clock ends at 1:42 PM",
         "targets": [
          "541489"
         ],
         "explain": "Pexton starts at 10 AM and his New Haven and Westport stops sit on the same stretch of I-95. Milford first on his day can still make 12 hours."
        },
        {
         "id": "louis-spread",
         "title": "Louis's day runs across two states",
         "targets": [
          "lane:louis",
          "541484",
          "540781"
         ],
         "explain": "Watertown, Branford, Holyoke and Worcester is hours of driving. Branford fits the shoreline better. By 5 PM it had moved to Phil."
        },
        {
         "id": "pexton-ends",
         "title": "Pexton's day runs end to end",
         "targets": [
          "541469",
          "540899"
         ],
         "explain": "Westport and Groton are at opposite ends of the Connecticut shoreline, almost 2 hours apart. Phil starts at 2 PM and works the eastern shoreline: Groton fits his night."
        }
       ],
       "fine": {
        "541339": "New Haven and North Haven are minutes apart. That pairing is fine.",
        "541346": "New Haven and North Haven are minutes apart. That pairing is fine.",
        "541478": "Watertown on its own is fine. Look at Louis's whole day."
       }
      }
     ]
    },
    {
     "key": "c2-w2-tue",
     "week": 2,
     "day": "tue",
     "kind": "lesson",
     "title": "Who's on at 5 PM?",
     "minutes": 10,
     "slides": [
      {
       "kind": "cover",
       "title": "Who's on at 5 PM?",
       "sub": "Calls that come in late in the day are saved or lost by knowing who is still working. Today you'll learn how to check.",
       "narration": "Who's on at 5 PM?. Calls that come in late in the day are saved or lost by knowing who is still working. Today you'll learn how to check."
      },
      {
       "kind": "shifts",
       "title": "The shift chart",
       "rows": [
        {
         "name": "Mark",
         "base": "Windsor Locks, CT",
         "days": "Mon-Fri",
         "hours": "10:00 AM-6:30 PM",
         "type": "day"
        },
        {
         "name": "Pexton",
         "base": "Hartford, CT",
         "days": "Tue-Sat",
         "hours": "10:00 AM-6:30 PM",
         "type": "day"
        },
        {
         "name": "Humam",
         "base": "Westfield, MA",
         "days": "Mon-Fri",
         "hours": "8:00 AM-4:30 PM",
         "type": "day"
        },
        {
         "name": "Bobby",
         "base": "Glens Falls, NY",
         "days": "Mon-Fri",
         "hours": "8:00 AM-4:30 PM",
         "type": "day"
        },
        {
         "name": "Antwaune",
         "base": "",
         "days": "Mon-Fri",
         "hours": "8:00 AM-4:30 PM",
         "type": "day"
        },
        {
         "name": "Ben",
         "base": "Arlington, MA",
         "days": "Sun-Thu",
         "hours": "10:00 AM-6:30 PM",
         "type": "day"
        },
        {
         "name": "Phil",
         "base": "Westborough, MA",
         "days": "Tue-Sat",
         "hours": "2:00-10:30 PM",
         "type": "evening"
        },
        {
         "name": "Holt",
         "base": "Waterbury, CT",
         "days": "Sun-Thu",
         "hours": "2:00-10:30 PM",
         "type": "evening"
        }
       ],
       "caption": "After 4:30 PM, only Mark, Pexton and Ben work until 6:30. Nights are Phil and Holt. Monday night is Holt alone. Saturday night is Phil alone.",
       "narration": "Here's the shift chart. After four thirty, only Mark, Pexton and Ben are on until six thirty. Nights are Phil and Holt. Monday night is Holt alone, and Saturday night is Phil alone."
      },
      {
       "kind": "list",
       "title": "The closest tech is not always the right tech",
       "items": [
        "A tech 15 minutes away who has 4 calls left and clocks out in an hour can't really take it.",
        "A tech 30 minutes away with one call left and 5 hours on his shift can.",
        "So for every tech, check three things: how far, how many calls are left, and when he clocks out."
       ],
       "narration": "The closest tech is not always the right tech. A tech 15 minutes away who has 4 calls left and clocks out in an hour can't really take it. A tech 30 minutes away with one call left and 5 hours on his shift can. So for every tech, check three things: how far, how many calls are left, and when he clocks out."
      },
      {
       "kind": "think",
       "title": "Real call: Derby, Sat 10/24",
       "facts": [
        "McDonald's #27001 in Derby came in at 3:21 PM. The clock ends at 3:21 AM.",
        "Pexton is closest, in New Haven, but he's on his first of 5 calls and clocks out at 6:30.",
        "Phil is in East Lyme, on his first of 3 calls, and works until 10:30 PM. His next call, Branford, is 30 minutes from Derby.",
        "Holt doesn't start until Sunday at 2:00 PM."
       ],
       "question": "Who takes Derby?",
       "answer": "Phil, right after Branford.",
       "why": "Pexton is closer on the map, but he can't finish what he already has. Phil has the hours and is heading that way.",
       "narration": "Real call: Derby, Sat 10/24. McDonald's #27001 in Derby came in at 3:21 PM. The clock ends at 3:21 AM. Pexton is closest, in New Haven, but he's on his first of 5 calls and clocks out at 6:30. Phil is in East Lyme, on his first of 3 calls, and works until 10:30 PM. His next call, Branford, is 30 minutes from Derby. Holt doesn't start until Sunday at 2:00 PM. Who takes Derby? Think about it, then tap to see the answer."
      },
      {
       "kind": "steps",
       "title": "A call comes in after 2 PM",
       "steps": [
        {
         "h": "Who is still on shift, and until when?",
         "p": "Use the shift chart, not your memory."
        },
        {
         "h": "Where is each tech, and how many calls are left?",
         "p": "Distance alone doesn't decide it."
        },
        {
         "h": "Give it to the tech who can actually finish it tonight",
         "p": "Then move something off his board if you need to."
        },
        {
         "h": "Nobody can make it tonight?",
         "p": "Make it tomorrow's first stop before you log off."
        }
       ],
       "narration": "A call comes in after 2 PM. Who is still on shift, and until when?. Use the shift chart, not your memory. Where is each tech, and how many calls are left?. Distance alone doesn't decide it. Give it to the tech who can actually finish it tonight. Then move something off his board if you need to. Nobody can make it tonight?. Make it tomorrow's first stop before you log off."
      },
      {
       "kind": "mission",
       "title": "Your mission this week",
       "text": "Every time a call comes in after 2 PM, say out loud who is still on, where they are, and how many calls they have left.",
       "narration": "Your mission this week. Every time a call comes in after 2 PM, say out loud who is still on, where they are, and how many calls they have left."
      }
     ]
    },
    {
     "key": "c2-w2-fri",
     "week": 2,
     "day": "fri",
     "kind": "play",
     "title": "Evening board and beat the clock",
     "minutes": 15,
     "activities": [
      {
       "kind": "board",
       "id": "c2-board-1026",
       "title": "Fix the board",
       "when": "Mon 10/26, 5:00 PM Dispatch Map",
       "intro": "Monday at 5:00 PM. Two techs are still working and two have clocked out. A Springfield McDonald's came in at 4:49 PM. Put it with someone who can actually do it tonight.",
       "lanes": [
        {
         "id": "mark",
         "name": "Mark",
         "info": "On until 6:30 PM. Finishing in Enfield, CT"
        },
        {
         "id": "holt",
         "name": "Holt",
         "info": "Waterbury, CT. On until 10:30 PM"
        },
        {
         "id": "danker",
         "name": "Bobby",
         "info": "Clocked out at 4:30 PM"
        },
        {
         "id": "antwaune",
         "name": "Antwaune",
         "info": "Clocked out at 4:30 PM"
        },
        {
         "id": "unscheduled",
         "name": "Unscheduled",
         "info": "Nobody owns these yet"
        }
       ],
       "jobs": [
        {
         "id": "541513",
         "lane": "mark",
         "store": "McDonald's #2070",
         "town": "Enfield, CT",
         "note": "Started. His last call"
        },
        {
         "id": "541506",
         "lane": "holt",
         "store": "Chili's #835",
         "town": "Bellingham, MA",
         "note": "On the way"
        },
        {
         "id": "541509",
         "lane": "holt",
         "store": "Price Chopper #231",
         "town": "Hopkinton, MA",
         "note": ""
        },
        {
         "id": "541533",
         "lane": "holt",
         "store": "Chick-fil-A #3951",
         "town": "Marlborough, MA",
         "note": ""
        },
        {
         "id": "541530",
         "lane": "holt",
         "store": "McDonald's #7461",
         "town": "Milford, CT",
         "note": ""
        },
        {
         "id": "541531",
         "lane": "holt",
         "store": "McDonald's #11601",
         "town": "Naugatuck, CT",
         "note": ""
        },
        {
         "id": "541505",
         "lane": "danker",
         "store": "McDonald's #12009",
         "town": "Palmer, MA",
         "note": "Redispatched for tomorrow"
        },
        {
         "id": "541498",
         "lane": "antwaune",
         "store": "Wendy's #2224",
         "town": "Worcester, MA",
         "note": "Dispatch change type"
        },
        {
         "id": "541534",
         "lane": "unscheduled",
         "store": "McDonald's #592",
         "town": "Springfield, MA",
         "note": "Came in 4:49 PM, High"
        }
       ],
       "goals": [
        {
         "id": "springfield",
         "title": "Springfield goes to the tech who can still save it",
         "hint": "Mark is finishing his last call in Enfield, about 20 minutes away, and works until 6:30. Holt has five calls across two states.",
         "points": 35,
         "test": {
          "job": "541534",
          "lanes": [
           "mark"
          ]
         }
        },
        {
         "id": "offshift",
         "title": "Nothing new lands on a tech who clocked out",
         "hint": "Bobby and Antwaune are done for the day. Calling them back is overtime, which is Qais's call.",
         "points": 15,
         "test": {
          "notIn": {
           "jobs": [
            "541534"
           ],
           "lanes": [
            "danker",
            "antwaune"
           ]
          }
         }
        },
        {
         "id": "zero",
         "title": "Zero unscheduled",
         "hint": "Every call has an owner before you log off.",
         "points": 10,
         "test": {
          "emptyLane": "unscheduled"
         }
        }
       ]
      },
      {
       "kind": "clock",
       "id": "c2-clock-derby",
       "title": "Beat the clock",
       "when": "Sat 10/24, 5:00 PM",
       "ticket": {
        "wo": "541493",
        "store": "McDonald's #27001",
        "address": "652 New Haven Ave, Derby, CT",
        "created": "Sat 10/24 3:21 PM",
        "clockEnds": "3:21 AM Sunday",
        "status": "Unscheduled, High"
       },
       "clockLabel": "12-hour clock",
       "startLeft": 621,
       "base": 180,
       "baseNote": "Phil finishes East Lyme and Branford, then drives about 30 minutes to Derby.",
       "steps": [
        {
         "prompt": "It's 5:00 PM Saturday. Who's on tonight?",
         "context": [
          "Pexton is in New Haven, on call 1 of 5, off at 6:30 PM.",
          "Phil is in East Lyme, call 1 of 3 (Branford, Torrington next), on until 10:30 PM.",
          "Holt is off until Sunday at 2:00 PM."
         ],
         "options": [
          {
           "label": "Phil. Derby goes right after Branford.",
           "rating": "best",
           "cost": 5,
           "why": "Phil is the one tech who can really reach it tonight."
          },
          {
           "label": "Ask Pexton first since he's closest, then Phil.",
           "rating": "good",
           "cost": 40,
           "why": "Checking is reasonable, but Pexton has four calls ahead and 90 minutes left. That call costs time."
          },
          {
           "label": "Leave it for Holt on Sunday.",
           "rating": "ok",
           "cost": 1400,
           "why": "Sunday at 2 PM is almost 23 hours after the call came in."
          },
          {
           "label": "Pexton. He's 15 minutes from Derby once he finishes New Haven.",
           "rating": "miss",
           "why": "Closest on the map, true. But he's on call 1 of 5 and clocks out at 6:30.",
           "cost": 300
          }
         ]
        },
        {
         "prompt": "Phil's night is now East Lyme, Branford, Torrington and Derby. What about Torrington?",
         "options": [
          {
           "label": "Move Torrington to Louis, who's in Watertown 20 minutes away. Phil goes Branford, then Derby.",
           "rating": "best",
           "cost": 0,
           "why": "Phil stays on the shoreline and Derby comes right after Branford."
          },
          {
           "label": "Phil does Derby, then Torrington if he has time.",
           "rating": "good",
           "cost": 20,
           "why": "Derby comes first, which is the important part."
          },
          {
           "label": "Torrington first, then Derby.",
           "rating": "ok",
           "cost": 150,
           "why": "Every call gets done, but Torrington is an hour out of the way."
          },
          {
           "label": "Move Branford to tomorrow so Phil can do Derby, then Torrington.",
           "rating": "miss",
           "why": "Making room is right, but Torrington is an hour inland. Branford is on the way.",
           "cost": 90
          }
         ]
        },
        {
         "prompt": "Before you log off:",
         "options": [
          {
           "label": "Update the ETA and Phil's arrival window in all systems.",
           "rating": "best",
           "cost": 0,
           "why": "Every system shows the plan, so the customer and Sunday's dispatcher both see it."
          },
          {
           "label": "Note it in Service Fusion only.",
           "rating": "good",
           "cost": 0,
           "why": "Sunday's dispatcher knows, but the other systems still show no ETA."
          },
          {
           "label": "Nothing. Phil has it.",
           "rating": "ok",
           "cost": 0,
           "why": "Phil does have it, but nobody else knows the plan."
          },
          {
           "label": "Text Phil the store's address and move on.",
           "rating": "miss",
           "why": "Phil has it, but the systems show nothing, so nobody else knows the plan.",
           "cost": 0
          }
         ]
        }
       ],
       "outcome": "On the real board, Derby was still unscheduled at 5:00 PM Saturday, with Phil on until 10:30 about an hour away."
      }
     ]
    }
   ]
  },
  {
   "id": 3,
   "title": "Parts and first-time fixes",
   "blurb": "Parts that move the same day, and the dispatch habits that stop second trips.",
   "sessions": [
    {
     "key": "c3-w1-tue",
     "week": 1,
     "day": "tue",
     "kind": "lesson",
     "title": "Parts move today",
     "minutes": 10,
     "slides": [
      {
       "kind": "cover",
       "title": "Parts move today",
       "sub": "When a tech marks a call Parts Needed, the clock keeps running. Today you'll learn what dispatch does the same day so the part is never the reason a call sits.",
       "narration": "Parts move today. When a tech marks a call Parts Needed, the clock keeps running. Today you'll learn what dispatch does the same day so the part is never the reason a call sits."
      },
      {
       "kind": "list",
       "title": "How a parts call should flow",
       "items": [
        "1. The tech marks the call Parts Needed and says which part.",
        "2. The same day, dispatch checks with inventory: do we have it?",
        "3. If we have it: get it to the tech and put the call back on a board.",
        "4. If we don't: order it right away. Don't wait until tomorrow.",
        "5. When the part is received, schedule the return visit."
       ],
       "narration": "How a parts call should flow. 1. The tech marks the call Parts Needed and says which part. 2. The same day, dispatch checks with inventory: do we have it? 3. If we have it: get it to the tech and put the call back on a board. 4. If we don't: order it right away. Don't wait until tomorrow. 5. When the part is received, schedule the return visit."
      },
      {
       "kind": "list",
       "title": "Where calls get stuck",
       "items": [
        "Nobody looks at the call after the tech marks it Parts Needed.",
        "Nobody checks if the part is already in stock.",
        "The part isn't ordered the same day.",
        "The part arrives, but nobody notices, so the visit never gets scheduled."
       ],
       "narration": "Where calls get stuck. Nobody looks at the call after the tech marks it Parts Needed. Nobody checks if the part is already in stock. The part isn't ordered the same day. The part arrives, but nobody notices, so the visit never gets scheduled."
      },
      {
       "kind": "think",
       "title": "Real call: East Lyme #32967",
       "facts": [
        "On 10/16 the call was marked Parts Needed on Pexton's board.",
        "Phil was finally working at that store on 10/24, 8 days later."
       ],
       "question": "Where could those 8 days have been lost?",
       "answer": "Most likely nobody checked the call on 10/16: is the part in stock, and if not, was it ordered that day?",
       "why": "A part that's in stock can go out the next day. A part ordered the same day usually arrives in a day or two. Eight days means the call sat with nobody checking it. The return visit is scheduled when the part is received, not before.",
       "narration": "Real call: East Lyme #32967. On 10/16 the call was marked Parts Needed on Pexton's board. Phil was finally working at that store on 10/24, 8 days later. Where could those 8 days have been lost? Think about it, then tap to see the answer."
      },
      {
       "kind": "steps",
       "title": "The morning parts check",
       "steps": [
        {
         "h": "Open every Parts Needed call",
         "p": "Every morning, before you build boards."
        },
        {
         "h": "Do we have the part?",
         "p": "Check with inventory. If yes, get it to the tech and schedule the call."
        },
        {
         "h": "If not, is it ordered?",
         "p": "If it isn't ordered yet, order it now."
        },
        {
         "h": "Is it urgent? Look for a same-day source",
         "p": "Another Coke service partner, Grainger or a hardware store. Keep the order as a backup."
        },
        {
         "h": "Part received?",
         "p": "Schedule the return visit right away."
        },
        {
         "h": "McDonald's past 2 days?",
         "p": "Email Coke: what part, ordered when, and when we expect it."
        }
       ],
       "narration": "The morning parts check. Open every Parts Needed call. Every morning, before you build boards. Do we have the part?. Check with inventory. If yes, get it to the tech and schedule the call. If not, is it ordered?. If it isn't ordered yet, order it now. Is it urgent? Look for a same-day source. Another Coke service partner, Grainger or a hardware store. Keep the order as a backup. Part received?. Schedule the return visit right away. McDonald's past 2 days?. Email Coke: what part, ordered when, and when we expect it."
      },
      {
       "kind": "think",
       "title": "Done right: Gales Ferry, Thu 10/8",
       "facts": [
        "A tech on site needed a water regulator that we didn't have in stock.",
        "The part was ordered for the next day.",
        "Grainger had none in Massachusetts or Connecticut."
       ],
       "question": "What else could get the store fixed today?",
       "answer": "A similar part from Home Depot, confirmed with Qais, while the ordered part stays as a backup.",
       "why": "That's what happened. The tech picked it up and finished the job, and Coke replied: great job.",
       "narration": "Done right: Gales Ferry, Thu 10/8. A tech on site needed a water regulator that we didn't have in stock. The part was ordered for the next day. Grainger had none in Massachusetts or Connecticut. What else could get the store fixed today? Think about it, then tap to see the answer."
      },
      {
       "kind": "mission",
       "title": "Your mission this week",
       "text": "Every morning this week, open every Parts Needed call. Make sure each part is either in stock and moving, or ordered. Schedule the visit the day the part is received.",
       "narration": "Your mission this week. Every morning, open every Parts Needed call. Make sure each part is either in stock and moving, or ordered. Schedule the visit the day the part is received."
      }
     ]
    },
    {
     "key": "c3-w1-fri",
     "week": 1,
     "day": "fri",
     "kind": "play",
     "title": "The part hunt",
     "minutes": 12,
     "activities": [
      {
       "kind": "clock",
       "id": "c3-clock-galesferry",
       "title": "Beat the clock",
       "when": "Thu 10/8, 1:40 PM",
       "ticket": {
        "wo": "G13-9315513",
        "store": "McDonald's",
        "address": "Gales Ferry, CT",
        "created": "Thu 10/8",
        "clockEnds": "Tech's day ends 6:30 PM",
        "status": "Tech on site, needs part 3505295"
       },
       "clockLabel": "Same-day fix window",
       "startLeft": 290,
       "base": 75,
       "baseNote": "Once a part is found, the tech needs about 75 minutes to pick it up, get back and fit it.",
       "steps": [
        {
         "prompt": "The tech needs part 3505295, a 3/4 in. water preset regulator. We don't have it in stock.",
         "options": [
          {
           "label": "Order it, and right away start looking for a same-day source: other Coke service partners, Grainger, a hardware store.",
           "rating": "best",
           "cost": 10,
           "why": "The order is the safety net. The hunt is how the store gets fixed today."
          },
          {
           "label": "Order it from MyCoke for tomorrow and move the tech to his next call.",
           "rating": "good",
           "cost": 1200,
           "why": "The part is coming, and the tech isn't standing around."
          },
          {
           "label": "Mark it Parts Needed and come back to it tomorrow.",
           "rating": "ok",
           "cost": 1500,
           "why": "The call is flagged, so it won't be forgotten."
          },
          {
           "label": "Send the tech to the warehouse to look himself.",
           "rating": "miss",
           "why": "Hands-on, but the warehouse already shows none. That's an hour of driving for nothing.",
           "cost": 90
          }
         ]
        },
        {
         "prompt": "Grainger has none in Massachusetts or Connecticut. The closest is Albany, NY.",
         "options": [
          {
           "label": "Check Home Depot for a part that will do the job, and confirm with Qais it's suitable.",
           "rating": "best",
           "cost": 25,
           "why": "A suitable substitute today beats the exact part tomorrow, as long as someone who knows the equipment signs off."
          },
          {
           "label": "Send the tech to Albany.",
           "rating": "good",
           "cost": 240,
           "why": "It would get the exact part today, but Albany is hours in the wrong direction."
          },
          {
           "label": "Stop here and wait for tomorrow's delivery.",
           "rating": "ok",
           "cost": 1100,
           "why": "Tomorrow's part is guaranteed to fit."
          },
          {
           "label": "Tell the tech to rig something until the part comes.",
           "rating": "miss",
           "why": "Keeping the store running is the goal, but an unapproved fix on a water regulator is a callback waiting to happen.",
           "cost": 60
          }
         ]
        },
        {
         "prompt": "Home Depot has a similar part. The tech is going to pick it up.",
         "options": [
          {
           "label": "Email Joe at Coke: what was missing, what you found, and that the backup part is still ordered for tomorrow.",
           "rating": "best",
           "cost": 0,
           "why": "Coke knows the store will be fixed today, and that there's a plan B."
          },
          {
           "label": "Keep the backup order, no email.",
           "rating": "good",
           "cost": 0,
           "why": "The safety net is in place. Coke would just like to know."
          },
          {
           "label": "Cancel the backup order since Home Depot had one.",
           "rating": "ok",
           "cost": 0,
           "why": "Saves an order, but if the substitute doesn't fit, you're back to zero."
          },
          {
           "label": "No email. Coke doesn't need the details.",
           "rating": "miss",
           "why": "Coke suggested the hunt. Telling them it worked is what earned the 'great job'.",
           "cost": 0
          }
         ]
        }
       ],
       "outcome": "This is what happened on 10/8. The part was found at Home Depot, the backup stayed ordered, and Joe at Coke wrote back: great job."
      },
      {
       "kind": "scenarios",
       "id": "c3-w1-scen",
       "title": "Pick the move",
       "items": [
        {
         "id": "east-lyme",
         "when": "Fri 10/16",
         "ticket": {
          "wo": "541171",
          "store": "McDonald's #32967",
          "address": "19 Chesterfield Rd, East Lyme, CT",
          "created": "",
          "clockEnds": "",
          "status": "Parts Needed (Pexton)"
         },
         "context": [
          "Pexton just marked this call Parts Needed and noted the part he needs."
         ],
         "prompt": "What do you do today?",
         "options": [
          {
           "label": "Check with inventory if we have the part. If we do, get it to the tech. If not, order it today.",
           "rating": "best",
           "why": "That's the whole job on day one. The part is either moving or ordered before you log off.",
           "better": []
          },
          {
           "label": "Order the part today.",
           "rating": "good",
           "why": "Ordering the same day is the key move.",
           "better": [
            "Check stock first. If we already have it, it can go out tomorrow instead of waiting on an order."
           ]
          },
          {
           "label": "Schedule the return visit for next week so it's on the board.",
           "rating": "ok",
           "why": "Wanting it on the calendar is good thinking.",
           "better": [
            "We schedule the return visit when the part is received. First check stock and order it."
           ]
          },
          {
           "label": "Leave it in Parts Needed. Inventory will see it.",
           "rating": "miss",
           "why": "Inventory does see the list.",
           "better": [
            "If nobody checks and orders, the call sits. That's how 8 days happen."
           ]
          }
         ]
        },
        {
         "id": "groton",
         "when": "Thu 10/22, 5:00 PM Dispatch Map",
         "ticket": {
          "wo": "540899",
          "store": "McDonald's #1223",
          "address": "561 Long Hill Rd, Groton, CT",
          "created": "",
          "clockEnds": "Past 2 days",
          "status": "Waiting for Parts (Pexton)"
         },
         "context": [
          "The part is on order. This call has been redispatched before."
         ],
         "prompt": "What's the move before you log off?",
         "options": [
          {
           "label": "Confirm with inventory the order went in and when it's expected, and email Joel and Kendrick: what part, when it's expected.",
           "rating": "best",
           "why": "The order is confirmed, and Coke hears the reason and the timing from us.",
           "better": []
          },
          {
           "label": "Confirm with inventory the order went in and when it's expected.",
           "rating": "good",
           "why": "Making sure the order is real is the most important part.",
           "better": [
            "It's a McDonald's past 2 days, so Coke gets an email too."
           ]
          },
          {
           "label": "Put the return visit on Pexton's board for Monday, in case the part comes in.",
           "rating": "ok",
           "why": "You want it to move fast. Good instinct.",
           "better": [
            "We schedule the visit when the part is received. A visit with no part is a wasted trip."
           ]
          },
          {
           "label": "Nothing. It's ordered, so it's handled.",
           "rating": "miss",
           "why": "Ordered is a good sign.",
           "better": [
            "Check the order is real and when it's due, and send the Coke email."
           ]
          }
         ]
        },
        {
         "id": "north-haven",
         "when": "Sat 10/24, 5:00 PM Dispatch Map",
         "ticket": {
          "wo": "541346",
          "store": "McDonald's #10877",
          "address": "365 Universal Dr N, North Haven, CT",
          "created": "",
          "clockEnds": "",
          "status": "Parts Needed (Pexton)"
         },
         "context": [
          "It's Saturday evening. Pexton just marked it Parts Needed."
         ],
         "prompt": "What happens before you log off?",
         "options": [
          {
           "label": "Get the part number from Pexton, check stock with inventory, and order it tonight if we don't have it.",
           "rating": "best",
           "why": "The order goes in tonight instead of Monday. That can save a whole day or two.",
           "better": []
          },
          {
           "label": "Get the part number from Pexton and leave a note for Monday to order it.",
           "rating": "good",
           "why": "Getting the part number while it's fresh is smart.",
           "better": [
            "If you can order tonight, do it. Monday means the part ships a day or two later."
           ]
          },
          {
           "label": "Plan the return visit on Pexton's next shift Tuesday.",
           "rating": "ok",
           "why": "Keeping it with Pexton helps first-time fixes.",
           "better": [
            "The visit is scheduled when the part is received. First, the part."
           ]
          },
          {
           "label": "Nothing until Monday. Parts can't move on the weekend.",
           "rating": "miss",
           "why": "Most suppliers are closed, true.",
           "better": [
            "Checking stock and placing the order can happen tonight."
           ]
          }
         ]
        }
       ]
      }
     ]
    },
    {
     "key": "c3-w2-tue",
     "week": 2,
     "day": "tue",
     "kind": "lesson",
     "title": "First time, every time",
     "minutes": 10,
     "slides": [
      {
       "kind": "cover",
       "title": "First time, every time",
       "sub": "A lot of first-time fixes are won at the dispatch desk, before the tech leaves. Today you'll learn how.",
       "narration": "First time, every time. A lot of first-time fixes are won at the dispatch desk, before the tech leaves. Today you'll learn how."
      },
      {
       "kind": "stat",
       "title": "Return trips on one morning",
       "big": "4 of 16",
       "label": "CCNA reactive calls on our techs' boards at 7:00 AM on Tue 10/27 were Redispatched",
       "text": "Palmer, Hartford #6882, Holyoke and Carmel. Each one is a truck rolling at least twice.",
       "narration": "On the seven o'clock map on Tuesday the twenty seventh, four of the sixteen CCNA reactive calls on our techs' boards were redispatched: Palmer, Hartford, Holyoke and Carmel. Each one is a truck rolling at least twice."
      },
      {
       "kind": "steps",
       "title": "Five things dispatch controls",
       "steps": [
        {
         "h": "Get the full story",
         "p": "If the call is vague, get more details before you dispatch."
        },
        {
         "h": "One call per piece of equipment",
         "p": "Each one gets its own fix and its own clock."
        },
        {
         "h": "Parts first",
         "p": "Make sure the part is on the van, or shipped ahead."
        },
        {
         "h": "Pass the last tech's notes on",
         "p": "A repeat call starts from what was already found."
        },
        {
         "h": "Send the right tech",
         "p": "Some equipment needs more experience."
        }
       ],
       "narration": "Five things dispatch controls. Get the full story. If the call is vague, get more details before you dispatch. One call per piece of equipment. Each one gets its own fix and its own clock. Parts first. Make sure the part is on the van, or shipped ahead. Pass the last tech's notes on. A repeat call starts from what was already found. Send the right tech. Some equipment needs more experience."
      },
      {
       "kind": "think",
       "title": "Real call: Winchendon #12061",
       "facts": [
        "10/19: first call, on Antwaune's board. Phil started it 10/20.",
        "10/22: a new call came in. Humam fixed it the next day.",
        "10/27: a third call, now on Ben's board."
       ],
       "question": "What should Ben get before he goes?",
       "answer": "The notes from all the earlier visits, and the parts they used.",
       "why": "Three calls in nine days is a pattern. If Ben starts where the last techs left off, it can be the last trip. Also ask Will if this store needs a senior tech.",
       "narration": "Real call: Winchendon #12061. 10/19: first call, on Antwaune's board. Phil started it 10/20. 10/22: a new call came in. Humam fixed it the next day. 10/27: a third call, now on Ben's board. What should Ben get before he goes? Think about it, then tap to see the answer."
      },
      {
       "kind": "think",
       "title": "Real call: Holyoke #1213",
       "facts": [
        "The call opened around 10/9.",
        "Redispatched to Louis on 10/24, and again on 10/27.",
        "Louis just started working on his own."
       ],
       "question": "What do you change for this trip?",
       "answer": "Find out what stopped Louis last time, line up the parts, and ask Will about sending Phil with him.",
       "why": "Phil is our field trainer. One visit together fixes the call and teaches Louis.",
       "narration": "Real call: Holyoke #1213. The call opened around 10/9. Redispatched to Louis on 10/24, and again on 10/27. Louis just started working on his own. What do you change for this trip? Think about it, then tap to see the answer."
      },
      {
       "kind": "mission",
       "title": "Your mission this week",
       "text": "For every redispatched call this week, find out why it's going back and write it on the call before the tech leaves.",
       "narration": "Your mission this week. For every redispatched call this week, find out why it's going back and write it on the call before the tech leaves."
      }
     ]
    },
    {
     "key": "c3-w2-fri",
     "week": 2,
     "day": "fri",
     "kind": "play",
     "title": "Spot the second trips",
     "minutes": 12,
     "activities": [
      {
       "kind": "spot",
       "id": "c3-spot-1023",
       "title": "Spot the lazy choice",
       "when": "Fri 10/23, 5:00 PM Dispatch Map",
       "intro": "The real Friday 5:00 PM board, CCNA calls only. Four things on it will cost a second trip or a missed clock. Tap a job or a tech's name to call one out.",
       "lanes": [
        {
         "id": "pexton",
         "name": "Pexton",
         "info": "Hartford, CT. On until 6:30 PM"
        },
        {
         "id": "louis",
         "name": "Louis",
         "info": "Weekday mornings"
        },
        {
         "id": "phil",
         "name": "Phil",
         "info": "Westborough, MA. On until 10:30 PM"
        }
       ],
       "jobs": [
        {
         "id": "541481",
         "lane": "pexton",
         "store": "McDonald's #29570",
         "town": "Charlton, MA",
         "note": "On the way"
        },
        {
         "id": "541469",
         "lane": "pexton",
         "store": "McDonald's #16332",
         "town": "Westport, CT",
         "note": "Dispatched"
        },
        {
         "id": "541458",
         "lane": "pexton",
         "store": "McDonald's #1382",
         "town": "Hartford, CT",
         "note": "Parts needed"
        },
        {
         "id": "541339",
         "lane": "pexton",
         "store": "McDonald's #6744",
         "town": "New Haven, CT",
         "note": "Paused. Came in Fri 10/16"
        },
        {
         "id": "541479",
         "lane": "louis",
         "store": "McDonald's #862",
         "town": "Northampton, MA",
         "note": "On the way"
        },
        {
         "id": "541478",
         "lane": "louis",
         "store": "McDonald's #3534",
         "town": "Watertown, CT",
         "note": "Dispatched"
        },
        {
         "id": "541218",
         "lane": "louis",
         "store": "McDonald's #2070",
         "town": "Enfield, CT",
         "note": "Redispatched"
        },
        {
         "id": "541483",
         "lane": "phil",
         "store": "Blackstone Valley 14 Cinema",
         "town": "Millbury, MA",
         "note": "Dispatched"
        }
       ],
       "problems": [
        {
         "id": "westport",
         "title": "Westport isn't happening today",
         "targets": [
          "541469"
         ],
         "explain": "At 5:00 PM Pexton is heading to Charlton, MA, and works until 6:30. Westport is about 2 hours from Charlton. Move it now and update the systems."
        },
        {
         "id": "phil-light",
         "title": "Phil has one call for a whole night",
         "targets": [
          "lane:phil",
          "541483"
         ],
         "explain": "Phil is on until 10:30 PM with one call in Millbury, about 20 minutes from Charlton. That's room to take Charlton off Pexton so Pexton can stay in Connecticut."
        },
        {
         "id": "newhaven",
         "title": "New Haven has been open a week",
         "targets": [
          "541339"
         ],
         "explain": "It came in Fri 10/16 at 9:29 PM and it's paused on Pexton's board. A McDonald's past 2 days needs the Coke email and a real plan, not another pause."
        },
        {
         "id": "parts",
         "title": "Hartford #1382 is Parts Needed. Is the part ordered?",
         "targets": [
          "541458"
         ],
         "explain": "Check with inventory: do we have it? If not, is it ordered? If it isn't ordered yet, order it now. When it's received, schedule the visit. Email Coke if it passes 2 days."
        }
       ],
       "fine": {
        "541218": "Look at Louis's whole day, not just this one.",
        "541479": "Louis is finishing his morning. That's fine on its own.",
        "541481": "Charlton is on his way right now. The question is what comes after it."
       }
      },
      {
       "kind": "scenarios",
       "id": "c3-w2-scen",
       "title": "Pick the move",
       "items": [
        {
         "id": "holyoke-third",
         "when": "Tue 10/27, 7:00 AM Dispatch Map",
         "ticket": {
          "wo": "541149",
          "store": "McDonald's #1213",
          "address": "2194 Northampton St, Holyoke, MA",
          "created": "Around 10/9",
          "clockEnds": "Long gone",
          "status": "Redispatched to Louis again"
         },
         "context": [
          "Louis was sent here on 10/24 too. This is at least the third trip. Louis just started working solo."
         ],
         "prompt": "What's the best plan for this trip?",
         "options": [
          {
           "label": "Call Louis: what blocked the last visit? Line up the parts, and ask Will about pairing him with Phil for this one.",
           "rating": "best",
           "why": "A third trip needs a different plan. Pairing a new solo tech with the field trainer fixes the call and teaches him.",
           "better": []
          },
          {
           "label": "Call Louis about what blocked him, line up the parts, and send him again.",
           "rating": "good",
           "why": "Finding the blocker and lining up parts is the core of it.",
           "better": [
            "Louis is new to working solo. On a third trip, backup from Phil is cheap insurance."
           ]
          },
          {
           "label": "Send a different tech for fresh eyes, with Louis's notes.",
           "rating": "ok",
           "why": "Fresh eyes do help sometimes, and the notes go with them.",
           "better": [
            "You still don't know what blocked the last visit. Find that out first."
           ]
          },
          {
           "label": "Send Louis again with a note to call in if he gets stuck.",
           "rating": "miss",
           "why": "Keeping the history with one tech is reasonable.",
           "better": [
            "That's the same plan as the last two trips.",
            "Same plan, same result."
           ]
          }
         ]
        },
        {
         "id": "ware-two",
         "when": "Tue 10/27",
         "ticket": {
          "wo": "541524 and 541525",
          "store": "McDonald's #2116",
          "address": "117 West St, Ware, MA",
          "created": "",
          "clockEnds": "",
          "status": "Both on one board"
         },
         "context": [
          "The store reported two different pieces of equipment down. One may need a part."
         ],
         "prompt": "How should these be set up?",
         "options": [
          {
           "label": "Two calls, one per piece of equipment, both on the same tech's board, each with its own notes.",
           "rating": "best",
           "why": "Each machine gets its own fix and its own clock, and one trip covers both.",
           "better": []
          },
          {
           "label": "Two calls on one tech's board, with all the notes on the first call.",
           "rating": "good",
           "why": "Splitting the calls and keeping one tech is right.",
           "better": [
            "Notes on the wrong call get lost at closeout. Each call keeps its own story."
           ]
          },
          {
           "label": "One call covering both machines, so the tech closes one ticket.",
           "rating": "ok",
           "why": "One tech, one trip. That part is right.",
           "better": [
            "If one machine needs a part, the whole call sits in Parts Needed and the working fix can't close.",
            "Split it."
           ]
          },
          {
           "label": "Two calls, sent to two different techs so both get fixed at once.",
           "rating": "miss",
           "why": "Parallel work sounds faster.",
           "better": [
            "Two trucks for one store wastes a trip.",
            "Keep both calls with one tech."
           ]
          }
         ]
        }
       ]
      }
     ]
    }
   ]
  },
  {
   "id": 4,
   "title": "Talk early, decide fast",
   "blurb": "Updates that land before anyone asks, and decisions you make yourself without waiting.",
   "sessions": [
    {
     "key": "c4-w1-tue",
     "week": 1,
     "day": "tue",
     "kind": "lesson",
     "title": "Tell them before they ask",
     "minutes": 10,
     "slides": [
      {
       "kind": "cover",
       "title": "Tell them before they ask",
       "sub": "Today you'll learn who needs to hear what, and what a good update looks like.",
       "narration": "Tell them before they ask. Today you'll learn who needs to hear what, and what a good update looks like."
      },
      {
       "kind": "columns",
       "title": "Who needs to hear what",
       "columns": [
        {
         "head": "Techs",
         "items": [
          "Which part is in, and for which call",
          "Board changes, before they leave",
          "The last tech's notes on a repeat call"
         ]
        },
        {
         "head": "Systems",
         "items": [
          "ETA and status updated in every system: Service Fusion, ServiceChannel, and the customer portals",
          "Notes added the same day",
          "Calls closed everywhere when the tech finishes"
         ]
        },
        {
         "head": "Coke",
         "items": [
          "McDonald's past 2 days: email Joel and Kendrick with the reason",
          "Every escalation answered the same day with a real ETA"
         ]
        },
        {
         "head": "Inventory",
         "items": [
          "The day a part is needed",
          "Same-day part searches, so nobody orders twice"
         ]
        }
       ],
       "caption": "If someone has to ask you, the update was late.",
       "narration": "Here's who needs to hear what. Techs: parts, board changes, and notes from the last tech. Systems: ETA, status and notes updated everywhere, and calls closed when the tech finishes. Coke: the two day email on McDonald's calls and same day answers on escalations. Inventory: the day a part is needed. If someone has to ask you, the update was late."
      },
      {
       "kind": "list",
       "title": "A good update has four parts",
       "items": [
        "What happened.",
        "What happens next.",
        "When: a time window or a date, not 'soon' or 'this afternoon'.",
        "Who is handling it."
       ],
       "narration": "A good update has four parts. What happened. What happens next. When: a time window or a date, not 'soon' or 'this afternoon'. Who is handling it."
      },
      {
       "kind": "think",
       "title": "Real escalation: Colchester, Fri 10/9, 10:13 AM",
       "facts": [
        "Coke escalated McDonald's #7681: the ABS is down. They asked for a reliable ETA.",
        "Our reply at 10:17 said: a technician is scheduled to be there this afternoon."
       ],
       "question": "Fast reply. What would make it better?",
       "answer": "An arrival window (for example 1:00 to 3:00 PM), and the ETA updated in the systems.",
       "why": "Four minutes is great. 'This afternoon' leaves Coke asking when. A window answers it once.",
       "narration": "Real escalation: Colchester, Fri 10/9, 10:13 AM. Coke escalated McDonald's #7681: the ABS is down. They asked for a reliable ETA. Our reply at 10:17 said: a technician is scheduled to be there this afternoon. Fast reply. What would make it better? Think about it, then tap to see the answer."
      },
      {
       "kind": "think",
       "title": "Real escalation: Gales Ferry, Fri 9/25",
       "facts": [
        "Our tech fixed McDonald's #10914 on 9/24.",
        "The next morning Coke escalated it anyway. In their system it was still open.",
        "Our reply went out Monday 9/28 with excellent notes."
       ],
       "question": "What would have stopped the escalation from happening at all?",
       "answer": "Close the call in every system the same day the tech finishes.",
       "why": "The notes were great. The call just wasn't closed in Coke's system. And any escalation gets an answer the same day, even on a Friday.",
       "narration": "Real escalation: Gales Ferry, Fri 9/25. Our tech fixed McDonald's #10914 on 9/24. The next morning Coke escalated it anyway. In their system it was still open. Our reply went out Monday 9/28 with excellent notes. What would have stopped the escalation from happening at all? Think about it, then tap to see the answer."
      },
      {
       "kind": "mission",
       "title": "Your mission this week",
       "text": "Before any update goes out this week, check it has all four parts: what, next, when, who.",
       "narration": "Your mission this week. Before any update goes out this week, check it has all four parts: what, next, when, who."
      }
     ]
    },
    {
     "key": "c4-w1-fri",
     "week": 1,
     "day": "fri",
     "kind": "play",
     "title": "Escalations and replies",
     "minutes": 12,
     "activities": [
      {
       "kind": "clock",
       "id": "c4-clock-colchester",
       "title": "Beat the clock",
       "when": "Fri 10/9, 10:13 AM",
       "ticket": {
        "wo": "G13-9328451",
        "store": "McDonald's #7681",
        "address": "375 S Main St, Colchester, CT",
        "created": "Coke 1st S1 escalation",
        "clockEnds": "",
        "status": "ABS down"
       },
       "clockLabel": "Answer clock",
       "startLeft": 60,
       "base": 0,
       "baseNote": "Coke asked for two things: a reliable ETA in the systems, and a reply to the escalation. Aim to close both within the hour.",
       "steps": [
        {
         "prompt": "The escalation just landed. First move?",
         "options": [
          {
           "label": "Get the tech's arrival window and update it in all systems.",
           "rating": "best",
           "cost": 8,
           "why": "The ETA is in every system fast, and you have what you need for Coke."
          },
          {
           "label": "Reply to Coke first, then update the systems.",
           "rating": "good",
           "cost": 15,
           "why": "Both happen, the systems just show the old status a little longer."
          },
          {
           "label": "Wait for the tech to confirm his time before calling anyone.",
           "rating": "ok",
           "cost": 60,
           "why": "Accurate, but the systems and Coke show nothing for an hour."
          },
          {
           "label": "Forward the escalation to the tech and let him handle the update.",
           "rating": "miss",
           "why": "The tech is driving or working. The escalation is dispatch's to answer.",
           "cost": 45
          }
         ]
        },
        {
         "prompt": "What do you reply to Coke?",
         "options": [
          {
           "label": "ETA updated at 10:20. The tech arrives between 1:00 and 3:00 PM today. We'll update you if that changes.",
           "rating": "best",
           "cost": 2,
           "why": "Coke can close the escalation on the spot."
          },
          {
           "label": "We have a technician scheduled to be there this afternoon.",
           "rating": "good",
           "cost": 15,
           "why": "Fast and clear. Without a window, Coke may write back asking for one."
          },
          {
           "label": "No reply. The tech is scheduled.",
           "rating": "ok",
           "cost": 45,
           "why": "Coke asked for a reply. Silence looks like nobody saw it."
          },
          {
           "label": "We're on it and will update you shortly.",
           "rating": "miss",
           "why": "Fast, but there's nothing Coke can do with it.",
           "cost": 30
          }
         ]
        },
        {
         "prompt": "1:45 PM: the tech is running 45 minutes late.",
         "options": [
          {
           "label": "Update the new window in all systems right away.",
           "rating": "best",
           "cost": 0,
           "why": "A slipped window called in early is still service."
          },
          {
           "label": "Wait and update it when the tech is 15 minutes out.",
           "rating": "good",
           "cost": 10,
           "why": "It gets updated, just at the last minute."
          },
          {
           "label": "Nothing. He'll be there soon.",
           "rating": "ok",
           "cost": 30,
           "why": "The customer is watching the ETA in the system too."
          },
          {
           "label": "Email Coke only, and leave the systems as they are.",
           "rating": "miss",
           "why": "Coke should hear it, but the customer sees the old ETA in the system.",
           "cost": 20
          }
         ]
        }
       ],
       "outcome": "The real reply went out in 4 minutes, which is great. The upgrade is an arrival window and the ETA updated in every system."
      },
      {
       "kind": "scenarios",
       "id": "c4-w1-scen",
       "title": "Pick the best reply",
       "items": [
        {
         "id": "gales-escalation",
         "when": "Fri 9/25, 7:54 AM",
         "ticket": {
          "wo": "G13-9285158",
          "store": "McDonald's #10914",
          "address": "1678 Route 12, Gales Ferry, CT",
          "created": "Coke 1st S1 escalation",
          "clockEnds": "",
          "status": "Our tech fixed it yesterday, 9/24"
         },
         "context": [
          "Coke's system still shows the call open, so it escalated."
         ],
         "prompt": "What do you do this morning?",
         "options": [
          {
           "label": "Reply now with the completion notes and close the call in Coke's system, then check what else from yesterday is still open there.",
           "rating": "best",
           "why": "Answers Coke the same morning, fixes this one, and catches the next one before it escalates.",
           "better": []
          },
          {
           "label": "Reply now with the completion notes and close the call in Coke's system.",
           "rating": "good",
           "why": "Same-day answer and the root cause fixed. Great.",
           "better": [
            "If one finished call wasn't closed in Coke's system, others from yesterday may not be either."
           ]
          },
          {
           "label": "Reply with good completion notes on Monday, when the tech can confirm.",
           "rating": "ok",
           "why": "Clear notes are exactly what Coke needs.",
           "better": [
            "The notes already exist. An escalation gets a same-day answer, even on a Friday."
           ]
          },
          {
           "label": "No reply needed. It's fixed, and Coke will see it on the report.",
           "rating": "miss",
           "why": "The store is fixed, which is the main thing.",
           "better": [
            "Coke doesn't know it's fixed. That's why they escalated.",
            "Silence on an escalation looks like nobody saw it."
           ]
          }
         ]
        },
        {
         "id": "carmel-email",
         "when": "Thu 10/22",
         "ticket": {
          "wo": "541366 and 541384",
          "store": "McDonald's #2121",
          "address": "1931 Route 6, Carmel, NY",
          "created": "On the board by 10/20",
          "clockEnds": "Past 2 days",
          "status": "Still open"
         },
         "context": [
          "Time for the 2-day email to Joel and Kendrick."
         ],
         "prompt": "Which email do you send?",
         "options": [
          {
           "label": "#2121 Carmel, NY will run past 2 days. Reason: [what the tech found]. Part: ordered [date], expected [date]. We go back the day it's received. We'll confirm when it's fixed.",
           "rating": "best",
           "why": "What, why, next, when, who. Coke can answer the customer without calling you.",
           "better": []
          },
          {
           "label": "#2121 Carmel, NY is waiting on a part. We'll confirm when it's fixed.",
           "rating": "good",
           "why": "Proactive, with a reason. That's most of it.",
           "better": [
            "Say when it was ordered and when it's expected."
           ]
          },
          {
           "label": "Heads up: Carmel #2121 is taking longer than expected. Working on it.",
           "rating": "ok",
           "why": "Proactive is the most important part.",
           "better": [
            "No reason and no date means Coke writes back asking both."
           ]
          },
          {
           "label": "Wait and send one email when it's fixed, so Coke gets good news.",
           "rating": "miss",
           "why": "It's natural to want to send good news.",
           "better": [
            "Coke asked to hear when it passes 2 days, not when it's done."
           ]
          }
         ]
        }
       ]
      }
     ]
    },
    {
     "key": "c4-w2-tue",
     "week": 2,
     "day": "tue",
     "kind": "lesson",
     "title": "Decide it yourself",
     "minutes": 10,
     "slides": [
      {
       "kind": "cover",
       "title": "Decide it yourself",
       "sub": "Most board decisions are yours to make. Today you'll learn which ones need Qais and which don't.",
       "narration": "Decide it yourself. Most board decisions are yours to make. Today you'll learn which ones need Qais and which don't."
      },
      {
       "kind": "columns",
       "title": "Who decides what",
       "columns": [
        {
         "head": "You decide",
         "items": [
          "The order of calls on any board",
          "Adding calls to fill a board",
          "Moving calls between nearby techs",
          "Shipping or delivering a part",
          "Splitting a call into one per piece of equipment"
         ]
        },
        {
         "head": "You decide, then tell Qais",
         "items": [
          "Moving a call to another tech's area",
          "Moving a customer to a later day",
          "Sending the McDonald's 2-day email",
          "Covering a tech who called out",
          "A call about to pass 36 hours"
         ]
        },
        {
         "head": "Ask Qais first",
         "items": [
          "Overtime or an extra shift",
          "Calling a tech back after he clocked out",
          "Sending a subcontractor",
          "A customer or Coke complaint",
          "Anything that changes cost"
         ]
        }
       ],
       "caption": "If it changes cost, ask. If it only changes the board, decide.",
       "narration": "Here's who decides what. Board order, filling boards, moving calls nearby, and parts: you decide. Moving a call to another area, moving a customer, the Coke email, covering a call out, and calls near thirty six hours: decide, then tell Qais. Overtime, calling a tech back, subcontractors, complaints, and anything that changes cost: ask first."
      },
      {
       "kind": "think",
       "title": "You decide: who decides?",
       "facts": [
        "Louis has one call. Devin has five and also covers dispatch.",
        "You want to move Palmer from Devin to Louis."
       ],
       "question": "Do you need to ask Qais?",
       "answer": "No. Move it, then tell Louis and Devin.",
       "why": "It only changes the board, and the towns are close. That's your call.",
       "narration": "You decide: who decides?. Louis has one call. Devin has five and also covers dispatch. You want to move Palmer from Devin to Louis. Do you need to ask Qais? Think about it, then tap to see the answer."
      },
      {
       "kind": "think",
       "title": "You decide: who decides?",
       "facts": [
        "A call came in at 4:49 PM. Humam is 15 minutes away but clocked out at 4:30.",
        "Mark is still on until 6:30, 20 minutes away."
       ],
       "question": "Do you call Humam back?",
       "answer": "No. Give it to Mark. Calling Humam back would be overtime, and that's Qais's call.",
       "why": "Always check who is still on shift first. Ask Qais only when no on-shift tech can do it, and bring him the facts.",
       "narration": "You decide: who decides?. A call came in at 4:49 PM. Humam is 15 minutes away but clocked out at 4:30. Mark is still on until 6:30, 20 minutes away. Do you call Humam back? Think about it, then tap to see the answer."
      },
      {
       "kind": "steps",
       "title": "The 30-second test",
       "steps": [
        {
         "h": "Which clock does this save?",
         "p": "If it saves a 12-hour clock, lean toward yes."
        },
        {
         "h": "Does it change cost?",
         "p": "Overtime, subs, extra trips: ask first."
        },
        {
         "h": "Is it on the 'you decide' list?",
         "p": "Then decide."
        },
        {
         "h": "Tell whoever's day changed",
         "p": "Techs, Coke, and update the systems."
        }
       ],
       "narration": "The 30-second test. Which clock does this save?. If it saves a 12-hour clock, lean toward yes. Does it change cost?. Overtime, subs, extra trips: ask first. Is it on the 'you decide' list?. Then decide. Tell whoever's day changed. Techs, Coke, and update the systems."
      },
      {
       "kind": "mission",
       "title": "Your mission this week",
       "text": "Make three decisions this week that you would have asked about before. Decide, then tell Qais after.",
       "narration": "Your mission this week. Make three decisions this week that you would have asked about before. Decide, then tell Qais after."
      }
     ]
    },
    {
     "key": "c4-w2-fri",
     "week": 2,
     "day": "fri",
     "kind": "play",
     "title": "Who decides?",
     "minutes": 12,
     "activities": [
      {
       "kind": "spot",
       "id": "c4-spot-1022",
       "title": "Fix it without asking",
       "when": "Thu 10/22, 5:00 PM Dispatch Map",
       "intro": "The real Thursday 5:00 PM board, CCNA calls only. Three things on it are yours to fix right now, no permission needed. Tap a job or a tech's name to call one out.",
       "lanes": [
        {
         "id": "holt",
         "name": "Holt",
         "info": "Waterbury, CT. On until 10:30 PM"
        },
        {
         "id": "pexton",
         "name": "Pexton",
         "info": "Hartford, CT. On until 6:30 PM. Other work today is not shown"
        },
        {
         "id": "louis",
         "name": "Louis",
         "info": "Weekday mornings"
        },
        {
         "id": "phil",
         "name": "Phil",
         "info": "Westborough, MA. On until 10:30 PM"
        }
       ],
       "jobs": [
        {
         "id": "541448",
         "lane": "holt",
         "store": "McDonald's #4623",
         "town": "Mansfield Center, CT",
         "note": "On the way"
        },
        {
         "id": "541453",
         "lane": "holt",
         "store": "McDonald's #17138",
         "town": "Fairfield, CT",
         "note": ""
        },
        {
         "id": "541458",
         "lane": "holt",
         "store": "McDonald's #1382",
         "town": "Hartford, CT",
         "note": ""
        },
        {
         "id": "541371",
         "lane": "holt",
         "store": "McDonald's #6882",
         "town": "Hartford, CT",
         "note": "Redispatched"
        },
        {
         "id": "540899",
         "lane": "pexton",
         "store": "McDonald's #1223",
         "town": "Groton, CT",
         "note": "Waiting for parts"
        },
        {
         "id": "541446",
         "lane": "louis",
         "store": "McDonald's #7620",
         "town": "Enfield, CT",
         "note": "Dispatched"
        },
        {
         "id": "541447",
         "lane": "phil",
         "store": "Gordon College Lane",
         "town": "Wenham, MA",
         "note": "On the way"
        },
        {
         "id": "541462",
         "lane": "phil",
         "store": "Residence of Natick South",
         "town": "Natick, MA",
         "note": "Dispatched"
        }
       ],
       "problems": [
        {
         "id": "zigzag",
         "title": "Holt's night zig-zags across Connecticut",
         "targets": [
          "lane:holt",
          "541448",
          "541453"
         ],
         "explain": "Mansfield Center is in eastern Connecticut and Fairfield is in the southwest corner, about 1 hour 45 minutes apart, with Hartford in between. Run it Mansfield, Hartford, then Fairfield, or make Fairfield a day tech's first stop tomorrow. Your call."
        },
        {
         "id": "hartford",
         "title": "Hartford #6882 is on the night shift again",
         "targets": [
          "541371"
         ],
         "explain": "It keeps getting redispatched on Holt's nights (it was still there on 10/25 and 10/27). Pexton lives in Hartford and starts at 10 AM. Make it his first stop tomorrow and tell both techs. No permission needed."
        },
        {
         "id": "groton",
         "title": "Groton is waiting for parts. Do we know the part is ordered?",
         "targets": [
          "540899"
         ],
         "explain": "Confirm with inventory that the order went in and when it's expected, then send Joel and Kendrick the 2-day email. You don't need permission for any of that. The visit gets scheduled when the part arrives."
        }
       ],
       "fine": {
        "541446": "Enfield for Louis tomorrow morning is fine.",
        "541447": "Phil's North Shore call is in his area tonight. That's fine.",
        "541458": "Hartford #1382 pairs nicely with the other Hartford call. Look at the rest of Holt's night."
       }
      },
      {
       "kind": "scenarios",
       "id": "c4-w2-scen",
       "title": "Who decides?",
       "items": [
        {
         "id": "move-calls",
         "when": "Tue 10/27, 7:00 AM Dispatch Map",
         "context": [
          "Louis has one call in Holyoke. Devin has five calls and also covers dispatch. Mark already has two Springfield calls."
         ],
         "prompt": "Moving Springfield #11540 to Mark and Palmer to Louis. Who decides?",
         "options": [
          {
           "label": "You do. Move them, then tell Mark, Louis and Devin before they roll.",
           "rating": "best",
           "why": "It only changes the board, and it's nearby. That's yours to decide.",
           "better": []
          },
          {
           "label": "You do. Move them and update the board. The techs will see it in their app.",
           "rating": "good",
           "why": "Right call, made by the right person.",
           "better": [
            "Techs plan their route from the morning board. Tell them directly when it changes."
           ]
          },
          {
           "label": "Move them, then message Qais so he knows.",
           "rating": "ok",
           "why": "Keeping Qais informed is never wrong.",
           "better": [
            "For nearby moves it isn't needed. Save his attention for cost and customer decisions."
           ]
          },
          {
           "label": "Ask Qais first and wait for his answer.",
           "rating": "miss",
           "why": "Checking first feels safe.",
           "better": [
            "Waiting costs the morning, and maybe a clock.",
            "Board moves are yours."
           ]
          }
         ]
        },
        {
         "id": "derby-ot",
         "when": "Sat 10/24, 5:00 PM",
         "context": [
          "Suppose Derby McDonald's (came in 3:21 PM) only fits on Phil's night if he stays until about 11:15 PM."
         ],
         "prompt": "Who decides on the overtime?",
         "options": [
          {
           "label": "Qais. Bring him the call, the clock, how late Phil would stay, and the alternative if he says no.",
           "rating": "best",
           "why": "Overtime changes cost, so it's Qais's call. With the facts and a plan B, it's a 30-second decision.",
           "better": []
          },
          {
           "label": "Qais. Ask him if Phil can stay late for Derby.",
           "rating": "good",
           "why": "Right person.",
           "better": [
            "Bring the numbers: what time, which clock, and what happens if he says no."
           ]
          },
          {
           "label": "Check first if moving Torrington to Louis makes it fit without overtime, then ask Qais only if it still doesn't.",
           "rating": "good",
           "why": "Trying the free fix first is a pro instinct.",
           "better": [
            "Good. If it still doesn't fit, go to Qais with the facts."
           ]
          },
          {
           "label": "Tell Phil to stay late. Saving the clock is worth 45 minutes.",
           "rating": "miss",
           "why": "Love the instinct to save the clock.",
           "better": [
            "Overtime changes cost, so it needs Qais first."
           ]
          }
         ]
        },
        {
         "id": "callback-humam",
         "when": "Mon 10/26, 5:00 PM",
         "context": [
          "Springfield #592 came in at 4:49 PM. Humam lives 15 minutes away but clocked out at 4:30. Mark is on until 6:30, finishing his last call in Enfield, 20 minutes away."
         ],
         "prompt": "What do you do?",
         "options": [
          {
           "label": "Give it to Mark tonight and send him the notes from Humam's 10/22 visit to this store.",
           "rating": "best",
           "why": "No overtime needed, the clock is saved, and Mark gets the history on a likely repeat.",
           "better": []
          },
          {
           "label": "Give it to Mark tonight.",
           "rating": "good",
           "why": "The free fix comes first. Clock saved.",
           "better": [
            "This store was fixed on 10/22. Send that visit's notes."
           ]
          },
          {
           "label": "Ask Qais whether Humam can go back out.",
           "rating": "ok",
           "why": "Right that overtime is Qais's call.",
           "better": [
            "Check who's still on shift first. Mark is."
           ]
          },
          {
           "label": "Call Humam and send him. He's closest and knows the store.",
           "rating": "miss",
           "why": "Closest on the map, true.",
           "better": [
            "He's off, so it's overtime, which needs Qais.",
            "Mark is on the clock 20 minutes away."
           ]
          }
         ]
        },
        {
         "id": "hartford-6882",
         "when": "Tue 10/27, 7:00 AM Dispatch Map",
         "context": [
          "Hartford #6882 has been redispatched on Holt's nights on 10/22, 10/25 and today. Pexton lives in Hartford, starts at 10:00 AM, and has room today."
         ],
         "prompt": "Who decides to move it, and what else happens?",
         "options": [
          {
           "label": "You move it to Pexton, ask Holt what blocked it, and pass that to Pexton before 10:00.",
           "rating": "best",
           "why": "Your call to make, and the blocker travels with the call.",
           "better": []
          },
          {
           "label": "You move it to Pexton and tell both techs.",
           "rating": "good",
           "why": "Right person, right move.",
           "better": [
            "Find out what blocked the last three trips. Otherwise Pexton walks into the same wall."
           ]
          },
          {
           "label": "Ask Holt whether he wants to keep it.",
           "rating": "ok",
           "why": "Respecting the tech's ownership is kind.",
           "better": [
            "The board is dispatch's decision, not the tech's."
           ]
          },
          {
           "label": "Leave it with Holt. Moving it again just adds another redispatch.",
           "rating": "miss",
           "why": "Fewer changes can feel calmer.",
           "better": [
            "Three redispatches on one board is the signal to change the plan."
           ]
          }
         ]
        },
        {
         "id": "sub",
         "when": "Any weekday",
         "context": [
          "Every tech near a Connecticut McDonald's is full today, and a subcontractor could go instead."
         ],
         "prompt": "Sending the subcontractor. Who decides?",
         "options": [
          {
           "label": "Rebuild the boards first. If it still doesn't fit, ask Qais with the call, the clock, and why our techs can't take it.",
           "rating": "best",
           "why": "Free fix first, then a ready answer for the person who owns cost.",
           "better": []
          },
          {
           "label": "Ask Qais right away with the call and the clock.",
           "rating": "good",
           "why": "Right person, with facts.",
           "better": [
            "Try rebuilding the board first. It might fit."
           ]
          },
          {
           "label": "Push it to tomorrow's first stop instead.",
           "rating": "ok",
           "why": "Keeps it with our techs and costs nothing.",
           "better": [
            "Check if the clock can be saved today first. If not, this is fine. Update the systems."
           ]
          },
          {
           "label": "Send the sub. The clock matters most.",
           "rating": "miss",
           "why": "The clock does matter.",
           "better": [
            "Subs change cost, so Qais decides."
           ]
          }
         ]
        }
       ]
      }
     ]
    }
   ]
  }
 ],
 "cheers": {
  "best": [
   "That's a Qais-level call.",
   "The clock just sent you a thank-you card.",
   "Coke would frame this one.",
   "Board saved. Somebody get this dispatcher a coffee.",
   "Textbook. Honestly, better than the textbook.",
   "The techs don't know it yet, but you just made their day easier."
  ],
  "good": [
   "Solid move. The job gets covered. Here's the pro version:",
   "You're on the right road. There's a faster lane:",
   "Good instinct. One tweak makes it great:",
   "That works. Want to see the move that makes it shine?"
  ],
  "ok": [
   "Totally fair call, and nothing breaks. Here's how to squeeze more out of it:",
   "That keeps things moving. Here's the move that saves the clock too:",
   "Plenty of dispatchers would do the same. Here's the upgrade:",
   "Safe and steady. Let's turn it into a pro move:"
  ],
  "miss": [
   "Easy one to fall into. Here's what it costs:",
   "Lots of dispatchers would pick this. Here's the catch:",
   "Close, but this one bites back. Here's why:",
   "Good thinking, wrong trap. Here's the better road:"
  ]
 }
};
