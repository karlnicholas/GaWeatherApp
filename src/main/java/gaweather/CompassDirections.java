package gaweather;

public enum CompassDirections {
    N, NNNE, NNE, NE, ENE, EENE,
    E, EESE, ESE, SE, SSE, SSSE,
    S, SSSW, SSW, SW, WSW, WWSW,
    W, WWNW, WNW, NW, NNW, NNNW;

    public static int convertToDegrees(CompassDirections d) {
        switch (d) {
            case N:
                return 0;
            case NNNE:
                return 15;
            case NNE:
                return 30;
            case NE:
                return 45;
            case ENE:
                return 60;
            case EENE:
                return 75;
            case E:
                return 90;
            case EESE:
                return 105;
            case ESE:
                return 120;
            case SE:
                return 135;
            case SSE:
                return 150;
            case SSSE:
                return 165;
            case S:
                return 180;
            case SSSW:
                return 195;
            case SSW:
                return 210;
            case SW:
                return 225;
            case WSW:
                return 240;
            case WWSW:
                return 255;
            case W:
                return 270;
            case WWNW:
                return 285;
            case WNW:
                return 300;
            case NW:
                return 315;
            case NNW:
                return 330;
            case NNNW:
                return 345;
            default: return 0;
        }
    }
}
