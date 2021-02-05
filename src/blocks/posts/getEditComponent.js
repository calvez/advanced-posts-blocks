/**
 * WordPress dependencies
 */
import {
	PanelBody,
	Placeholder,
	Spinner,
	SelectControl,
	Disabled,
	FormTokenField,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ServerSideRender } from '@wordpress/editor';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import QueryControls from '../../util/QueryControls';

const TermControl = ( { taxonomy, termIds, handleChange } ) => {
	const categories =
		useSelect(
			( select ) => {
				return select( 'core' ).getEntityRecords(
					'taxonomy',
					taxonomy.slug,
					{
						per_page: -1,
					}
				);
			},
			[ taxonomy ]
		) ?? [];

	const categoriesMapById = categories.reduce( ( acc, category ) => {
		return {
			...acc,
			[ category.id ]: category,
		};
	}, {} );
	const categoriesMapByName = categories.reduce( ( acc, category ) => {
		return {
			...acc,
			[ category.name ]: category,
		};
	}, {} );

	return categories && categories.length > 0 ? (
		<FormTokenField
			key={ taxonomy.rest_base }
			label={ taxonomy.labels.name }
			value={ termIds.map( ( categoryId ) => {
				return categoriesMapById[ categoryId ].name;
			} ) }
			suggestions={ categories.map( ( category ) => category.name ) }
			onChange={ ( newCategoryNames ) => {
				const categoryIds = newCategoryNames.map(
					( categoryName ) => categoriesMapByName[ categoryName ]?.id
				);
				if ( ! categoryIds.includes( undefined ) ) {
					handleChange( categoryIds );
				}
			} }
		/>
	) : null;
};

const getEditComponent = ( blockName, blockTitle ) => {
	return ( {
		attributes,
		setAttributes,
		latestPosts,
		taxonomies,
		selectedPostType,
		postTypes,
	} ) => {
		const {
			order,
			orderBy,
			postsToShow,
			offset,
			ignoreStickyPosts,
			showAllPosts,
		} = attributes;
		const labels = selectedPostType.labels || {};

		const PostTypeControls = (
			<SelectControl
				label={ __( 'Post Type', 'advanced-posts-blocks' ) }
				value={ selectedPostType.slug }
				options={ postTypes.map( ( type ) => ( {
					label: type.name,
					value: type.slug,
				} ) ) }
				onChange={ ( postType ) => {
					setAttributes( {
						postType,
						orderBy: '',
					} );
				} }
			/>
		);

		const TermControls = taxonomies.map( ( taxonomy, i ) => {
			const termIds =
				attributes[ taxonomy.rest_base ]?.terms ??
				attributes[ taxonomy.rest_base ] ??
				[];
			return (
				<TermControl
					key={ i }
					taxonomy={ taxonomy }
					termIds={ termIds }
					handleChange={ ( value ) => {
						setAttributes( {
							[ taxonomy.rest_base ]: {
								terms: value,
							},
						} );
					} }
				/>
			);
		} );

		const title = __( 'Query setting', 'advanced-posts-blocks' );

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ title }>
					{ PostTypeControls }
					{ TermControls }
					<QueryControls
						{ ...{
							order,
							orderBy,
							offset,
							ignoreStickyPosts,
							showAllPosts,
						} }
						postType={ selectedPostType }
						numberOfItems={ postsToShow }
						onOffsetChange={ ( value ) =>
							setAttributes( { offset: value } )
						}
						onOrderChange={ ( value ) =>
							setAttributes( { order: value } )
						}
						onOrderByChange={ ( value ) =>
							setAttributes( { orderBy: value } )
						}
						onNumberOfItemsChange={ ( value ) =>
							setAttributes( { postsToShow: value } )
						}
						onIgnoreStickyPostsChange={ ( value ) =>
							setAttributes( { ignoreStickyPosts: value } )
						}
						onshowAllPostsChange={ ( value ) => {
							setAttributes( { showAllPosts: value } );
						} }
					/>
				</PanelBody>
			</InspectorControls>
		);
		const hasPosts = Array.isArray( latestPosts ) && latestPosts.length;
		if ( ! hasPosts ) {
			return (
				<div { ...useBlockProps() }>
					{ inspectorControls }
					<Placeholder icon="admin-post" label={ blockTitle }>
						{ ! Array.isArray( latestPosts ) ? (
							<Spinner />
						) : (
							labels.not_found
						) }
					</Placeholder>
				</div>
			);
		}
		return (
			<div { ...useBlockProps() }>
				{ inspectorControls }
				<Disabled>
					<ServerSideRender
						block={ blockName }
						attributes={ attributes }
					/>
				</Disabled>
			</div>
		);
	};
};

export default getEditComponent;
