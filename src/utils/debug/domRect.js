	/**
	 * A helper function to visualize DOMRect or set of DOMRect instances.
	 *
	 * Subsequent calls will remove previously marked elements.
	 *
	 *		Debug a element currently focused in your devtools inspector.
	 *		markRect( $0.getBoundingClientRect() );
	 *		// Debug a selection.
	 *		markRect( document.getSelection().getRangeAt( 0 ).getClientRects() );
	 */
	var drawnRect = [];

	/**
	 * @param {DOMRect/DOMRect[]} rectangles
	 */
	const markRect = ( rectangles ) => {
		// Cleanup.
		drawnRect.forEach( function( oldRect ) {
			oldRect.remove();
		} );

		// Unify format.
		if ( typeof rectangles.length == 'undefined' ) {
			rectangles = [ rectangles ];
		} else {
			rectangles = Array.from( rectangles );
		}

		rectangles.forEach( function( rect ) {
			var curDrawing = createRectDraw(),
				dims = [ 'top', 'left', 'width', 'height' ];

			dims.forEach( function( property ) {
				curDrawing.style[ property ] = rect[ property ] + 'px';
			} );

			console.log( 'created debug rect:', curDrawing );

			drawnRect.push( curDrawing );
		} );
	}

  export default markRect;

	function createRectDraw() {
		var ret = document.createElement( 'div' );
		ret.style.position = 'absolute';
		ret.style.outline = '2px solid red';
    ret.style.pointerEvents = 'none';
		ret.className = 'debug-rect-marker';
		document.body.appendChild( ret );

		return ret;
	}
  window.markRect = markRect
