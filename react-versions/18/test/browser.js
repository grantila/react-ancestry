import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

import puppeteer from 'puppeteer'

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const pagePath =
	path.normalize( path.resolve( __dirname, '../dist/index.html' ) );

const mode = process.argv[ 2 ];
if ( ![ 'dev', 'prod' ].includes( mode ) )
	throw new Error( 'Missing mode' );

( async ( ) =>
{
	const browser = await puppeteer.launch( );
	const page = await browser.newPage( );
	await page.goto( `file://${pagePath}` );

	const text = await page.$eval( '#testdiv', page => page.innerHTML );

	await browser.close( );

	const expectationFile = path.resolve( __dirname, `expected-${mode}.txt` );
	const expected =
		new RegExp(
			fs.readFileSync( expectationFile, 'utf-8' )
			.replace( /</g, '&lt;' )
			.replace( />/g, '&gt;' )
		);
	if ( !text.match( expected ) )
	{
		console.error( `result   = ${text}` );
		console.error( `expected = ${expected}` );
		throw new Error( 'webpack test failed' );
	}
} )( );
