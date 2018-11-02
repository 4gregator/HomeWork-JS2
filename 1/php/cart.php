<?php
require_once('config.php');
session_start();

$response = '';

$id = isset($_GET['id']) && is_numeric($_GET['id']) && isset($products[$_GET['id']]) ? intval($_GET['id']) : false;
$method = isset($_GET['method']) && in_array($_GET['method'], array('clear', 'add', 'get', 'remove')) ? $_GET['method'] : false;
$response = array('result' => 0);

if ( $method ) {
	switch ( $method ) {
		case 'get':
			$items = isset($_SESSION['cart']) ? $_SESSION['cart'] : array();
			$response = array(
				'result' => 1,
				'items' => array_values($items)
			);
			break;
		case 'add':
			if ( $id ) {
				$items = isset($_SESSION['cart']) ? $_SESSION['cart'] : array();
				$item = $products[$id];
				if ( isset($items[$id]) ) {
					++$items[$id]['count'];
				} else {
					$items[$id] = $item;
					$items[$id]['count'] = 1;
				}
				$_SESSION['cart'] = $items;
				$response = array(
					'result' => 1,
					'item' => $items[$id]
				);
			}
			break;
		case 'remove':
			if ( $id ) {
				$items = isset($_SESSION['cart']) ? $_SESSION['cart'] : array();

				if ( isset($items[$id]) ) {
					if ( $items[$id]['count'] > 1 ) {
						--$items[$id]['count'];
					} else {
						unset($items[$id]);
					}
					$_SESSION['cart'] = $items;
					$response = array(
						'result' => 1,
						'id' => $id
					);
				}
			}
			break;
		case 'clear':
			$_SESSION['cart'] = array();
			$response = array('result' => 1);
			break;
		default:
			$response = array('result' => 0);
			break;
	}
}

exit(json_encode($response));
