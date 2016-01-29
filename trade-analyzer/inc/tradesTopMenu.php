<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Igor Matyas (matyas.igor@gmail.com)
 * Date: Oct/2/13
 * Time: 4:24 PM
 */

global $currentTopMenu;
?>

<div class="navbar navbar-inverse navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <a class="brand" href="/">Trades</a>
            <ul class="nav">
                <li <? if ($currentTopMenu == 'parser') { ?>class="active"<? } ?>><a href="/parser.php">Parser</a></li>
                <li <? if ($currentTopMenu == 'aggregator') { ?>class="active"<? } ?>><a href="/aggregator.php">Aggregator</a></li>
                <li <? if ($currentTopMenu == 'analyzer') { ?>class="active"<? } ?>><a href="/analyzer.php">Analyzer</a></li>
            </ul>
        </div>
    </div>
</div>