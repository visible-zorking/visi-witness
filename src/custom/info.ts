
/* Return the initial sourceloc to display. */
export function sourceloc_start() : string
{
    return 'J:217:1:234:0';  // 'gverbs.zil', lines 217-233
}

// Presentation order. Filenames must match game-info!
export const sourcefile_presentation_list: string[] = [
    'witness.zil',
    'places.zil',
    'people.zil',
    'things.zil',
    'main.zil',
    'events.zil',
    'parser.zil',
    'syntax.zil',
    'verbs.zil',
    'macros.zil',
    'clock.zil',
];
