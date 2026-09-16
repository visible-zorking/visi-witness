_The Witness_ was originally written by Stu Galley. It is copyright 1983
(etc) by Infocom, then Activision, then renamed to Mediagenic, then
Bobby Kotick bought it and renamed it Activision, then Vivendi bought
it and merged it with Blizzard, then Microsoft consumed the lot.

Thus, the _Witness_ source code is copyright 2025 by Microsoft.
Microsoft has not released this game as open source, but I’m going at
it regardless.

The [Visible Zorker Project][vz] was created by Andrew Plotkin.
MIT license; [Github repo][github]. Hosted by the
[Obsessively Complete Infocom Catalog][ocicat].

[vz]: https://eblong.com/infocom/visi/
[github]: https://github.com/visible-zorking/visi-witness
[ocicat]: https://eblong.com/infocom/

---

*Editor's note:* The archived _Witness_ source does not exactly match
the r23 game file (even though they were found together). The source
code contains a few changes which were never compiled.
 
(We should also note that _Witness_ r23 was not a release version! It
was a "final development" version and may contain undetected bugs.)
 
I have attempted to reconstruct the source code *as of the latest r23
compile* by reverting all source changes that don't match the game file.
See `***VZ:***` comments in these files. For clarity, I will refer to
the archived source as "r23+".
