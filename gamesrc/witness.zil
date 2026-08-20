"COMPILE/LOAD FILE for WITNESS
Copyright (C) 1983 Infocom, Inc.  All rights reserved."

;"*** VISIBLE ZORKER NOTE***
  The archived Witness source does not exactly match the r23 game file
  (even though they were found together). The source code contains a few
  changes which were never compiled.

  (We should also note that Witness r23 was not a release version! It
  was a 'final development' version and may contain undetected bugs.)

  I have attempted to reconstruct the source code *as of the latest r23
  compile* by reverting all source changes that don't match the game file.
  See '***VZ:***' comments in these files. For clarity, I will refer to
  the archived source as 'r23+'.

  It is likely that I missed a few spots, and my formatting is mostly
  guesswork.
  [--zarf, 2026/06/20]
  *** END NOTE ***"

<COND (<GASSIGNED? PREDGEN>
       <SETG ZSTR-ON <SETG ZSTR-OFF ,TIME>>
       <PRINC "Compiling">
       <ID 0>)
      (T <PRINC "Loading">)>

<PRINC " WITNESS: An INTERLOGIC Mystery
">

ON!-INITIAL	"for DEBUGR"
OFF!-INITIAL
ENABLE!-INITIAL
DISABLE!-INITIAL

<COND (<GASSIGNED? PREDGEN>
       <BLOAT 90000 0 0 3500 0 0 0 0 0 512>)>

<SET REDEFINE T>

<CONSTANT SERIAL 0>

<OR <GASSIGNED? ZILCH>
    <SETG WBREAKS <STRING !\" !,WBREAKS>>>

<DEFINE IFILE (STR "OPTIONAL" (FLOAD? <>) "AUX" (TIM <TIME>))
	<INSERT-FILE .STR .FLOAD?>>

<DIRECTIONS NORTH SOUTH EAST WEST NE NW SE SW UP DOWN IN OUT>

<IFILE "MACROS" T>
<IFILE "SYNTAX" T>

<IFILE "PLACES" T>
<IFILE "PEOPLE" T>
<IFILE "THINGS" T>

<ENDLOAD>
<IFILE "CLOCK" T>
<IFILE "MAIN" T>
<IFILE "PARSER" T>
<IFILE "VERBS" T>
<IFILE "EVENTS" T>

<PROPDEF SIZE 5>
<PROPDEF CAPACITY 0>

<GC-MON T>
<COND (<GASSIGNED? PREDGEN>
       <GC 0 T 5>)>
