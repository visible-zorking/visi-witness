import React from 'react';
import { useContext } from 'react';

import { ZilSourceLoc } from '../visi/main';
import { ReactCtx } from '../visi/context';
import { Commentary } from '../visi/widgets';

import { get_legal_state, LegalState } from './modgame';

export function SolvePage()
{
    let rctx = useContext(ReactCtx);
    let legal = get_legal_state(rctx.zstate);
    console.log('### legal', legal); //###

    return (
        <div className="ScrollContent">
            <div className="SolutionPage">
                <p>
                    This tab shows every possible outcome of arresting each
                    character (or combination of characters).
                </p>
                <p>
                    Beware <i>SPOILERS!</i> Even more spoilery than usual
                    for the Visible Zorker.
                </p>
                <p>
                    .<br/>.<br/>.<br/>.
                </p>
                <BeforeArrest legal={ legal } />
            </div>
        </div>
    );
}

function BeforeArrest({ legal }: { legal:LegalState })
{
    let outcome;
    if (legal.corpse_invisible) {
        outcome = 0;
    }
    else if (!legal.met_duffy) {
        outcome = 1;
    }
    else {
        outcome = 2;
    }
    
    return (
        <div>
            <h3 className="Arrest">(Pre-crime)</h3>
            <div className="Cond">
                You haven't seen Linder die:
            </div>
            <div className={ check(outcome, 0) }>
                You have no evidence of a crime yet.
            </div>
            
            <div className="Cond">
                You haven't met Sergeant Duffy yet tonight (<IdRef val="GLOB:MET-DUFFY?" />):
            </div>
            <div className={ check(outcome, 1) }>
                 You'll have to wait for him to help you make the arrest.
            </div>
        </div>
    );
}

function check(outcome:number, val:number): string
{
    if (outcome == val)
        return "Outcome Current";
    else
        return "Outcome";
}

// This doesn't require a context, turns out.
function evhan_click_id(ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) {
    ev.preventDefault();
    let dat: ZilSourceLoc = { id: id, commentary: true };
    window.dispatchEvent(new CustomEvent('zil-source-location', { detail:dat }));
}

function IdRef({ val }: { val:string })
{
    let valname = val;
    let pos = val.indexOf(':');
    if (pos >= 0) {
        valname = val.slice(pos+1);
    }
    
    return (
        <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, val) }><code>{ valname }</code></a>
    )
}

function ArrestRef({ suspect, line }: { suspect:string, line:string })
{
    return (
        <h3 className="Arrest"><a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'SRC:'+line) }>ARREST { suspect }</a></h3>
    )
}
