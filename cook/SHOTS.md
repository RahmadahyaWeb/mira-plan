# Shots (UI: one shot = one screen state at a fixed viewport)

| Shot | Ref | Viewport | Shows | Take from ref | Watch for |
|---|---|---|---|---|---|
| S01 | R02, R03 | 1440x900 | Landing hero | huge chunky headline centered, characters (unicorn) flanking it, pill CTA, sticker tag, airy white canvas, complete above fold | headline too big, hero cut off, empty gaps |
| S02 | R04 | 375x812 | Landing hero mobile | stacked headline, illustration peeks from edges, CTA visible above fold | horizontal scroll, mascot too small |
| S03 | R03 | 1440x900 | Plan wizard step | black-outlined pill choices, one question per step, mascot helper | form looks generic |
| S04 | R02, R03 | 1440x900 | Today tracker | checklists for meals + workouts, progress ring, kcal, streak, mascot reacts | dense but tidy, color not washed out |
| S05 | R04 | 375x812 | Today tracker mobile | same, stacked | tap targets >= 44px |
| S06 | R02 | 1440x900 | Week plan | 7 day columns/cards with meals + workout per day | cramped text |
| S07 | R01 | 600x800 | Mascot as rendered in site vs R01 | same art, clean edges, no white halo on colored bg | trace artifacts |
| S09 | R03, R04 | 1440x900 | Login | outlined pill inputs and buttons, mascot or sticker so the form is not a bare card, same chunky type as landing | plain generic form, empty canvas |
| S10 | R03, R04 | 1440x900 | Register | same as login, password rules readable | long form below fold |
| S09m | R04 | 375x812 | Login mobile | form above fold, tap targets >= 44px | horizontal scroll |
| S07m | R01, R04 | 375x812 | Meal detail mobile | title above fold, plate + mascot | tab bar covering content |
| S03m | R04 | 375x812 | Wizard mobile | one question visible, pills >= 44px | stage pushes Next below fold |
| S06m | R04 | 375x812 | Week mobile | days stacked, meals readable | cramped, horizontal scroll |
| S10m | R04 | 375x812 | Register mobile | form above fold | long form below fold |
| S11 | R02, R03 | 1440x900 | Library | page heading with character, tabs as pills, rows tidy | bare list, empty page |
| S11m | R04 | 375x812 | Library mobile | rows fit: name, tag, Edit/Delete not squeezed | truncated names, wrapped buttons |
| S12 | R03 | 1440x900 | Library add form | outlined inputs, two columns | long generic form |
| S12m | R04 | 375x812 | Library add form mobile | one column, inputs full width | horizontal scroll |
| S13 | R03 | 1440x900 | Day editor dialog over Today | clear rows, Replace/Remove pills | cramped buttons |
| S13m | R04 | 375x812 | Day editor mobile | rows fit 343px, buttons >= 44px | wrapped names, tiny buttons |
