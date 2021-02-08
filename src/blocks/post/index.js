/**
 * External dependencies
 */
import { isUndefined, pickBy } from 'lodash';

/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
/**
 * Internal dependencies
 */
import getEditComponent from './getEditComponent';
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { usePosts, usePostType } from '../../util/hooks';

import metadata from './block.json';

const { name, supports, category } = metadata;
const title = __( 'Single Post', 'advanced-posts-blocks' );
const EditComponent = getEditComponent( name, title );

const Edit = ( props ) => {
	const { attributes } = props;
	const { postType: postTypeName } = attributes;
	const selectedPostType = usePostType( postTypeName );
	const PostsQuery = pickBy(
		{
			per_page: -1,
			advanced_posts_blocks: true,
		},
		( value ) => ! isUndefined( value )
	);

	const newProps = {
		...props,
		posts: usePosts( selectedPostType, PostsQuery ),
		selectedPostType,
	};
	return <EditComponent { ...newProps } />;
};

registerBlockType( name, {
	supports,
	category,
	title: `${ title } (Advanced Posts Blocks)`,
	description: __( 'Display single post.', 'advanced-posts-blocks' ),
	keywords: [ 'single post', __( 'single post', 'advanced-posts-blocks' ) ],
	icon: (
		//https://material.io/tools/icons/?icon=description&style=outline
		<SVG
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<Path fill="none" d="M0 0h24v24H0V0z" />
			<Path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
		</SVG>
	),
	edit: Edit,
	save() {
		return null;
	},
} );
