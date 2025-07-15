<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Ticket;
use App\Models\FilmSession;

use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\Logo\Logo;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Writer\ValidationException;

class TicketController extends Controller
{

    public function index(Request $request)
    {
        $seatsArr = $request->input("seatsArr");
        $sessionId = $request->input('session_id');

        foreach($seatsArr as $seat) {
            $seatFromTable = FilmSession::find($sessionId)->hall->seats->where('seat_number', '=', $seat)->value('id');
            if (Ticket::where('seat_id', $seatFromTable)->exists()) {
                return 'Не повезло';
            }
        }

        $qrData = $request->input('session_id', 'seatsArr');

        $qrCode = new QrCode(
            data: $qrData,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::Low,
            size: 300,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin,
            foregroundColor: new Color(0, 0, 0),
            backgroundColor: new Color(255, 255, 255)
        );

        $writer = new PngWriter();
        $result = $writer->write($qrCode)->getString();

        $filename = time().'.png';
        $path = 'public/qrcodes/'.$filename;

        Storage::put($path, $result);

        foreach($seatsArr as $seat) {
            $ticket = new Ticket();
            $ticket->session_id = $sessionId;
            $ticket->url = Storage::url($path);
            $ticket->seat_id = FilmSession::find($sessionId)->hall->seats->where('seat_number', '=', $seat)->value('id');
            $ticket->save();
        }

        return Storage::url($path);
    }

  
}
