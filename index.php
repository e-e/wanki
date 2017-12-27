<?php
// get txt files from: https://wanikanitoanki.com/export

$submitted = $_POST['submitted'] ?? false;
$order_normal = $_POST['order_normal'] ?? false;
$order_reversed = $_POST['order_reversed'] ?? false;
if ($submitted) {
  function format_Basic($rows) {
    $data = [];
    foreach ($rows as $row) {
      $row = [
        'front' => $row['character'],
        'back' => implode('<br><br>', [$row['meaning'], $row['kana']]),
        'tags' => implode(',', [$row['type'], $row['level'], 'order-normal'])
      ];
      $data[] = $row;
    }
    return $data;
  }

  function format_BasicReversed($rows) {
    $data = [];
    foreach ($rows as $row) {
      $row = [
        'front' => $row['meaning'],
        'back' => implode('<br><br>', [$row['character'], $row['kana']]),
        'tags' => implode(',', [$row['type'], $row['level'], 'order-reversed'])
      ];
      $data[] = $row;
    }
    return $data;
  }

  function dataToString($data) {
    $rows = [];
    foreach ($data as $row) {
      $rowStr = implode(";", $row);
      $rows[] = $rowStr;
    }
    return implode("\n", $rows);
  }

  // $source = "C:\\Users\\Eric\\Downloads\\vocabulary.txt";
  $source = $_FILES["sourcefile"]["tmp_name"];

  $rows = explode("\n", file_get_contents($source));

  $data = [];
  foreach ($rows as $row) {
    $row = trim($row);
    if ($row[0] === '#') continue;
    $row = explode(";", $row);
    $row = [
      'key' => $row[0],
      'type' => $row[1],
      'character' => $row[2],
      'meaning' => $row[3],
      'image' => $row[4],
      'onyomi' => $row[5],
      'kunyomi' => $row[6],
      'important_reading' => $row[7],
      'kana' => $row[8],
      'level' => $row[9],
    ];
    $data[] = $row;
  }




  $basic = [];
  $reversed = [];

  if ($order_normal) {
    $basic = format_Basic($data);
  }

  if ($order_reversed) {
    $reversed = format_BasicReversed($data);
  }

  $data = array_merge( $basic, $reversed );
  $datastr = dataToString($data);

  header('Content-Disposition: attachment; filename="vocabulary.txt"');
  header('Content-Type: text/plain');
  header('Content-Length: ' . strlen($datastr));
  header('Connection: close');
  echo $datastr;
  exit();
}


?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <form method="post" enctype="multipart/form-data" action="">
    <div>
      <label for="order_normal">
        <input type="checkbox" name="order_normal" id="order_normal" />
        Basic
      </label>
    </div>
    <div>
      <label for="order_reversed">
        <input type="checkbox" name="order_reversed" id="order_reversed" />
        Basic Reversed
      </label>
    </div>
    <input type="file" name="sourcefile" />
    <input type="hidden" name="submitted" value="1"/>
    <button type="submit">convert</button>
  </form>
</body>
</html>