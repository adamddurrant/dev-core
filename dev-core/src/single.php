<?php
/**
 * The template for displaying single posts
 *
 */

get_header();

global $post;

// todo:
// mustache.render("content_{$post->post_type}");
?><h3>No template for this content type - <?php echo $post->post_type ?></h3> <?php

get_footer();
