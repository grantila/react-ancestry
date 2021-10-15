import React, { useCallback, useState } from 'react'
import { render } from 'react-dom'

import { Ancestry, AncestryElement } from './react-ancestry'

const div = document.createElement( 'div' );
document.documentElement.appendChild( div );

render(<Root />, div);

function Root( )
{
	return <LevelOne />
}

function LevelOne( )
{
	return <LevelTwo />
}

function LevelTwo( )
{
	return <LevelThree />
}

function LevelThree( )
{
	const [ancestry, setAncestry] = useState('ancestry not found');

	const onAncestry = useCallback(
		( ancestry: Array< AncestryElement > ) =>
		{
			setAncestry(
				ancestry
				.map( ( { name, type } ) => `<${name}:${type}>` )
				.join( '' )
			);
		},
		[ setAncestry ]
	);

	return <div id="testdiv">
		<Ancestry onAncestry={onAncestry} />
		{ancestry}
	</div>
}
