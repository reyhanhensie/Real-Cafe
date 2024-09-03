<!DOCTYPE html>
<html>
<head>
    <title>Order Receipt</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .receipt {
            text-align: center;
            margin: 0 auto;
            max-width: 600px;
        }
        .receipt h2 {
            margin: 0;
        }
        .receipt ul {
            list-style-type: none;
            padding: 0;
        }
        .receipt li {
            margin-bottom: 5px;
        }
        .receipt p {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="receipt">
        <h2>REAL CAFE</h2>
        <h3>Pesanan Anda</h3>
        <p>Nomor Meja: {{ $mejaNo }}</p>
        <ul>
            @foreach ($orderItems as $item)
                <li>{{ $item->quantity }}x {{ $item->item_name }} - Rp. {{ $item->price }}</li>
            @endforeach
        </ul>
        <h3>Total Harga: Rp. {{ $totalPrice }}</h3>
        @if ($message)
            <p>Catatan: {{ $message }}</p>
        @endif
    </div>
</body>
</html>
