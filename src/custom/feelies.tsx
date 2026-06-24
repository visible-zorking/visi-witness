import React from 'react';

import { ExtWebLink } from './about';

export function FeeliesPage()
{
    return (
        <div className="ScrollContent">
            <div className="FeeliesPage">
                <h2>Commands for detectives</h2>
                <p>
                    A few commands particular to Infocom&#x2019;s mystery
                    games:
                </p>
                <p>
                    <code>EXAMINE <i>something</i> CAREFULLY</code>
                    {' '}&nbsp;{' '}
                    <i>(takes longer but may uncover more information)</i>
                    <br/>
                    <code>FINGERPRINT <i>something</i></code>
                    <br/>
                    <code>ANALYZE <i>something</i></code>
                    <br/>
                    <code>ANALYZE <i>something</i> FOR <i>something</i></code>
                    <br/>
                    <code>ACCUSE <i>suspect</i> OF <i>something</i></code>
                    <br/>
                    <code>WAIT <i>number</i> MINUTES</code>
                    <br/>
                    <code>WAIT UNTIL <i>time</i></code>
                    <br/>
                    <code>WAIT FOR <i>person</i></code>
                    <br/>
                    <code>ARREST <i>suspect</i></code>
                </p>
                <p>
                    The familiar commands{' '}
                    <code>ASK <i>suspect</i> ABOUT <i>something</i></code>
                    {' '}and{' '}
                    <code>SHOW <i>something</i> TO <i>suspect</i></code>
                    {' '}will be useful as well.
                </p>
                <h2>Documentary evidence</h2>
                <p>
                    <i>The Witness</i> originally came with a
                    &#x201C;Documentary Evidence&#x201D; file.
                    This provided your introduction to the mystery,
                    the background of some of the characters, and evidence
                    you need to begin your investigation.
                </p>
                <p>
                    You can view scans of these documents here.
                </p>
                <p>
                    Note: These images are scanned from the the honest-to-Frob
                    copy of <i>The Witness</i> that I played as a kid! They are
                    from the original 1983 &#x201C;Folio&#x201D; release of
                    the game. For a scan of the &#x201C;Grey Box&#x201D;
                    manual, visit the{' '}
                    <ExtWebLink url={ 'https://infodoc.plover.net/manuals/temp/witness.pdf' } text={ 'InfoDoc Project' } />.
                    For high-resolution scans, visit the{' '}
                    <ExtWebLink url={ 'https://archive.org/details/Infocom_Witness_Apple/' } text={ 'Internet Archive' } />.
                </p>
                <hr />
                <FeelieLink url={ 'telegram.jpg' } width={ 250 } height={ 181 } text={ 'Telegram from Freeman Linder' } />
                <FeelieLink url={ 'letter.jpg' } width={ 200 } height={ 306 } text={ 'Letter from Virginia Linder to Monica' } />
                <FeelieLink url={ 'newspaper-front.jpg' } width={ 300 } height={ 410 } text={ 'Newspaper front page' } />
                <FeelieLink url={ 'newspaper-back.jpg' } width={ 300 } height={ 410 } text={ 'Newspaper back page' } />
                <FeelieLink url={ 'matchbook.jpg' } width={ 120 } height={ 134 } text={ 'Matchbook found on curb' } />
                <hr />
            </div>
        </div>
    );
}

function FeelieLink({ url, text, width, height } : { url:string, text:string, width:number, height:number })
{
    return (
        <p className="Feelie">
            <a href={ './pic/'+url } target="_blank">
                <img src={ './pic/thumb/'+url } width={ width } height={ height } />
            </a>
            <br/>
            <a href={ './pic/'+url } target="_blank">{ text }</a>
        </p>
    )
}
