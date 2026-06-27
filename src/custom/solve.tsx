import React from 'react';
import { useContext } from 'react';

import { ZilSourceLoc } from '../visi/main';
import { ReactCtx } from '../visi/context';
import { Commentary } from '../visi/widgets';

//import { get_legal_state, LegalState } from './modgame';

export function SolvePage()
{
    let rctx = useContext(ReactCtx);
    //let legal = get_legal_state(rctx.zstate);

    return (
        <div className="ScrollContent">
            <div className="SolutionPage">
            </div>
        </div>
    );
}
