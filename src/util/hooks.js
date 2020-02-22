import { useSelect } from '@wordpress/data';

export const usePostTypes = () =>
	useSelect(
		( select ) => select( 'core' ).getPostTypes( { per_page: -1 } ) || [],
		[]
	);

export const usePostType = ( postType ) =>
	useSelect( ( select ) => select( 'core' ).getPostType( postType ) || {}, [
		postType,
	] );

export const usePostTypeTaxonomies = ( postType ) =>
	useSelect(
		( select ) =>
			( select( 'core' ).getTaxonomies() || [] ).filter( ( taxonomy ) => {
				const postTypeTaxonomies = postType.taxonomies || [];
				return postTypeTaxonomies.includes( taxonomy.slug );
			} ),
		[ postType ]
	);

export const useTermsGroupByTaxonomy = ( taxonomies ) =>
	useSelect(
		( select ) => {
			const obj = {};
			for ( const taxonomy of taxonomies ) {
				obj[ taxonomy.rest_base ] =
					select( 'core' ).getEntityRecords(
						'taxonomy',
						taxonomy.slug,
						{ per_page: -1 }
					) || [];
			}
			return obj;
		},
		[ taxonomies ]
	);

export const usePosts = ( postType, query ) =>
	useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords(
				'postType',
				postType.slug,
				query
			) || [],
		[ postType, query ]
	);

export const useCurrentPostId = () =>
	useSelect( ( select ) => select( 'core/editor' ).getCurrentPostId(), [] );

export const useCurrentPostType = () =>
	useSelect( ( select ) => select( 'core/editor' ).getCurrentPostType(), [] );
