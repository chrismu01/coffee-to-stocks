<?php
/*
Plugin Name: Coffee-to-Stocks Calculator
Description: Slider widget + Chart.js that shows the future value of latte money.
Version: 1.0
Author: Jordyn Vo
*/

function c2s_enqueue() {
  wp_enqueue_script(
    'chartjs',
    'https://cdn.jsdelivr.net/npm/chart.js',
    array(),
    null,
    true
  );

  wp_enqueue_script(
    'c2s-js',
    plugins_url( 'coffee.js', __FILE__ ),
    array( 'chartjs' ),
    '1.0',
    true
  );

  wp_enqueue_style(
    'c2s-css',
    plugins_url( 'coffee.css', __FILE__ )
  );
}
add_action( 'wp_enqueue_scripts', 'c2s_enqueue' );

function c2s_markup() {
  ob_start(); ?>
    <div class="c2s-widget">
      <label>
        Daily latte cost $
        <input id="c2s_cost" type="number" min="1" step="0.25" value="4">
      </label>

      <label>
        Years invested
        <input id="c2s_years" type="range" min="5" max="30" value="20">
        <span id="c2s_years_lbl">20</span>
      </label>

      <canvas id="c2s_chart" height="200"></canvas>
    </div>
  <?php
  return ob_get_clean();
}
add_shortcode( 'coffee_calculator', 'c2s_markup' );
?>
