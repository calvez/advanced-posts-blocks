<?php
/**
 * Initialize.
 *
 * @package Advanced_Posts_Blocks
 */

namespace Advanced_Posts_Blocks;

require_once dirname( __FILE__ ) . '/autoload.php';

add_action(
	'init',
	function () {
		load_plugin_textdomain( 'advanced-posts-blocks', false, basename( PLUGIN_FILE ) . '/languages' );
	}
);

add_action(
	'init',
	function () {
		new Blocks\Post\Renderer( 'advanced-posts-blocks/post' );
		new Blocks\Posts\Renderer( 'advanced-posts-blocks/posts' );
		new Blocks\Children\Renderer( 'advanced-posts-blocks/children' );
	},
	9999
);

add_action(
	'enqueue_block_editor_assets',
	function () {
		$script_asset = require( dirname( PLUGIN_FILE ) . '/build/index.asset.php' );
		wp_enqueue_script(
			'advanced-posts-blocks',
			plugins_url( 'build/index.js', PLUGIN_FILE ),
			$script_asset['dependencies'],
			$script_asset['version'],
			true
		);
		wp_set_script_translations( 'advanced-posts-blocks', 'advanced-posts-blocks', basename( PLUGIN_FILE ) . '/languages' );
	}
);

