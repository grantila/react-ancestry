import React, { useCallback, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { Ancestry, AncestryElement } from './react-ancestry'

const div = document.createElement( 'div' );
document.documentElement.appendChild( div );

const root = createRoot( div );
root.render( <Root /> );

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
