/**
 * External dependencies
 */
import { isUndefined, pickBy } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	PanelBody,
	Placeholder,
	ComboboxControl,
	Disabled,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ServerSideRender } from '@wordpress/editor';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import PostTypeControl from '../../util/PostTypeControl';
import metadata from './block.json';
import { usePosts, usePostType } from '../../util/hooks';

const { name } = metadata;

const Edit = ( { attributes, setAttributes } ) => {
	const { postId } = attributes;
	const { postType: postTypeName } = attributes;
	const selectedPostType = usePostType( postTypeName );
	const posts = usePosts(
		selectedPostType,
		pickBy(
			{
				per_page: -1,
				advanced_posts_blocks: true,
			},
			( value ) => ! isUndefined( value )
		)
	);

	const PostControls = (
		<ComboboxControl
			help={ __( 'Select post' ) }
			label={ __( 'Post' ) }
			value={ postId }
			options={ [
				...posts.map( ( post ) => ( {
					label: `${ post.title.rendered } (ID: ${ post.id })`,
					value: post.id,
				} ) ),
			] }
			onChange={ ( value ) => {
				setAttributes( {
					postId: value ? parseInt( value ) : undefined,
				} );
			} }
		/>
	);

	const title = __( 'Query setting', 'advanced-posts-blocks' );

	const inspectorControls = (
		<InspectorControls>
			<PanelBody title={ title }>
				<PostTypeControl
					value={ selectedPostType }
					onChange={ ( postType ) => {
						setAttributes( { postId: undefined } );
						setAttributes( { postType: postType.slug } );
					} }
				/>
				{ PostControls }
			</PanelBody>
		</InspectorControls>
	);

	return (
		<div { ...useBlockProps() }>
			{ inspectorControls }
			{ postId ? (
				<Disabled>
					<ServerSideRender
						block={ name }
						attributes={ attributes }
					/>
				</Disabled>
			) : (
				<Placeholder
					icon="admin-post"
					label={ __( 'Single Post', 'advanced-posts-blocks' ) }
				>
					{ __( 'Post Not Found.', 'advanced-posts-blocks' ) }
				</Placeholder>
			) }
		</div>
	);
};

export default Edit;
