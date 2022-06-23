import { Component } from 'react'


export interface AncestryElement
{
	name: string;
	type: 'component' | 'element';
}

export interface AncestryProps
{
	onAncestry( ancestry: Array< AncestryElement > ): void;
}

function classNameOf( instance: Object | undefined ): string | undefined
{
	return !instance?.constructor
		? undefined
		: instance.constructor === Function
		? undefined
		: instance.constructor.name;
}

function elementOf( owner: ReactInternals17DevOwner ): AncestryElement
{
	return typeof owner.type === 'string'
		? { name: owner.type, type: 'element' }
		: {
			name:
				classNameOf( owner.type )
				?? owner.type?.displayName
				?? owner.type?.name
				?? 'unknown',
			type: 'component',
		};
}

// ============== React 16 development/production build ================

interface ReactInternals16
{
	_reactInternalFiber?: ReactInternals16Inner;
}

interface ReactInternals16Inner
{
	return?: ReactInternals16Inner;
	type?: string | {
		displayName?: string;
		name?: string;
	};
}

function getStack16( owner?: ReactInternals16Inner ): Array< AncestryElement >
{
	const recurse =
		( owner?: ReactInternals16Inner ): Array< AncestryElement > =>
		{
			return ( !owner?.return || typeof owner?.type === 'undefined' )
				? [ ]
				: [ ...recurse( owner.return ), elementOf( owner ) ];
		};
	return recurse( owner );
}

function isReact16( component: any ): component is ReactInternals16
{
	return typeof component._reactInternalFiber?.return?.type !== 'undefined';
}

// ============== React 17/18 development build ================

interface ReactInternals17Dev
{
	_reactInternals?: {
		_debugOwner?: ReactInternals17DevOwner;
	};
}

interface ReactInternals17DevOwner
{
	type?: string | {
		displayName?: string;
		name?: string;
	};
	_debugOwner?: ReactInternals17DevOwner;
	child?: ReactInternals17DevOwner;
}

function getStack17Dev( owner?: ReactInternals17DevOwner )
: Array< AncestryElement >
{
	const recurse =
		( owner?: ReactInternals17DevOwner ): Array< AncestryElement > =>
		{
			return !owner
				? [ ]
				: [ ...recurse( owner._debugOwner ), elementOf( owner ) ];
		};
	return recurse( owner );
}

function isReact17Dev( component: any ): component is ReactInternals17Dev
{
	return component._reactInternals?._debugOwner?.child;
}

// ============== React 17/18 production build ================

interface ReactInternals17Prod
{
	_reactInternals?: ReactInternals17Inner;
}
interface ReactInternals17Inner
{
	return?: ReactInternals17Inner;
	type?: string | {
		displayName?: string;
		name?: string;
	};
}

function getStack17Prod( cmp?: ReactInternals17Inner )
: Array< AncestryElement >
{
	const recurse =
		( cmp?: ReactInternals17Inner ): Array< AncestryElement > =>
		{
			return ( !cmp?.return || !cmp?.type )
				? [ ]
				: [ ...recurse( cmp.return ), elementOf( cmp ) ];
		};
	return recurse( cmp );
}

function isReact17Prod( component: any ): component is ReactInternals17Prod
{
	return component._reactInternals?.return?.type;
}

// === Generic ===

export function getAncestry( component: Component ): Array< AncestryElement >
{
	try
	{
		if ( isReact16( component ) )
		{
			// React 16 build
			return getStack16( component._reactInternalFiber?.return );
		}
		else if ( isReact17Dev( component ) )
		{
			// React 17 dev build
			return getStack17Dev(
				component._reactInternals?._debugOwner?.child
			);
		}
		else if ( isReact17Prod( component ) )
		{
			// React 17 prod build
			return getStack17Prod( component._reactInternals?.return );
		}
		return [ ];
	}
	catch ( _err )
	{
		return [ ];
	}
}

export class Ancestry extends Component< AncestryProps >
{
	private _ancestry: Array< AncestryElement > | undefined = undefined;

	constructor( props: AncestryProps )
	{
		super( props );
	}

	render( )
	{
		if ( !this._ancestry )
		{
			const ancestry = getAncestry( this );

			this._ancestry = ancestry;
			setTimeout(
				( ) =>
				{
					this.props.onAncestry( ancestry );
				},
				0
			);
		}
		return null;
	}
}
