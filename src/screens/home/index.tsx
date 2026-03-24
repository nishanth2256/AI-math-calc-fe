import { ColorSwatch, Group } from '@mantine/core';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import { SWATCHES } from '@/constants';
import { Eraser, Pencil } from 'lucide-react';

interface GeneratedResult {
    expression: string;
    answer: string;
}

interface Response {
    expr: string;
    result: string;
    assign: boolean;
}

interface RenderItem {
    type: "math" | "text";
    expression: string;
    answer: string;
}

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('rgb(255, 255, 255)');
    const [reset, setReset] = useState(false);
    const [dictOfVars, setDictOfVars] = useState({});
    const [result, setResult] = useState<GeneratedResult>();
    const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
    const [results, setResults] = useState<RenderItem[]>([]);

    // MathJax render
    useEffect(() => {
        if (results.length > 0 && window.MathJax) {
            setTimeout(() => {
                window.MathJax?.Hub?.Queue(["Typeset", window.MathJax.Hub]);
            }, 0);
        }
    }, [results]);

    useEffect(() => {
        if (result) {
            renderLatexToCanvas(result.expression, result.answer);
        }
    }, [result]);

    useEffect(() => {
        if (reset) {
            resetCanvas();
            setResults([]);
            setResult(undefined);
            setDictOfVars({});
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = 'round';
                ctx.lineWidth = 3;
            }
        }

        const script = document.createElement('script');
        script.src =
            'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.MathJax.Hub.Config({
                tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    // 🔥 Updated render function
    const renderLatexToCanvas = (expression: string, answer: string) => {
        const isMath = /^[0-9x+y\-*/^=().\s]+$/.test(expression);

        setResults((prev) => [
            ...prev,
            {
                type: isMath ? "math" : "text",
                expression,
                answer
            }
        ]);

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

const formatToLatex = (expr: any) => {
    if (expr === undefined || expr === null) return "";

    let latex = String(expr);

    // Powers: x^2 → x^{2}
    latex = latex.replace(/([a-zA-Z0-9\)])\^([0-9]+)/g, '$1^{$2}');

    // Fractions: x^3/3 → \frac{x^3}{3}
    latex = latex.replace(/([a-zA-Z0-9\}\)])\/([0-9]+)/g, '\\frac{$1}{$2}');

    // Integral
    latex = latex.replace(/∫/g, '\\int ');
    latex = latex.replace(/integrate/g, '\\int ');

    // dx spacing
    latex = latex.replace(/dx/g, '\\, dx');

    // Derivative d/dx
    latex = latex.replace(/d\/dx/g, '\\frac{d}{dx}');

    // Multiplication
    latex = latex.replace(/\*/g, '\\cdot ');

    // sqrt
    latex = latex.replace(/sqrt\((.*?)\)/g, '\\sqrt{$1}');

    // pi
    latex = latex.replace(/pi/g, '\\pi');

    return latex;
};
    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.background = 'black';
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                setIsDrawing(true);
            }
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                ctx.stroke();
            }
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const setToDraw = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.globalCompositeOperation = 'source-over';
                ctx.lineWidth = 3;
            }
        }
    };

    const setToErase = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = 10;
            }
        }
    };

    const runRoute = async () => {
        try {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/calculate`,
                {
                    image: canvas.toDataURL('image/png'),
                    dict_of_vars: dictOfVars
                }
            );

            const resp = response.data;
            const responseData = resp.data ? resp.data : resp;

            if (!Array.isArray(responseData)) return;

            responseData.forEach((data) => {
                if (data.assign === true) {
                    setDictOfVars((prev) => ({
                        ...prev,
                        [data.expr]: data.result
                    }));
                }
            });

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const i = (y * canvas.width + x) * 4;
                    if (imageData.data[i + 3] > 0) {
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }

            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;
            setLatexPosition({ x: centerX, y: centerY });

            responseData.forEach((data, index) => {
                setTimeout(() => {
                    setResult({
                        expression: data.expr,
                        answer: data.result
                    });
                }, 1000 * (index + 1));
            });

        } catch (error: any) {
            console.error("Axios Error:", error);
        }
    };

    return (
        <>
            <div className='grid grid-cols-5 gap-4'>
                <Button onClick={() => setReset(true)} className='z-20 bg-black text-white'>
                    Reset
                </Button>

                <Group className='z-20'>
                    {SWATCHES.map((swatch) => (
                        <ColorSwatch key={swatch} color={swatch} onClick={() => setColor(swatch)} />
                    ))}
                </Group>

                <Button onClick={setToErase} className='z-20 bg-black w-25'>
                    <Eraser size={40} color="#f2f2f2" strokeWidth={1.75} />
                </Button>

                <Button onClick={setToDraw} className='z-20 bg-black'>
                    <Pencil size={40} color="#f2f2f2" strokeWidth={1.75} />
                </Button>

                <Button onClick={runRoute} className='z-20 bg-black text-white'>
                    Run
                </Button>
            </div>

            <canvas
                ref={canvasRef}
                className='absolute top-0 left-0 w-full h-full'
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />

            {results.map((item, index) => (
                <Draggable
                    key={index}
                    defaultPosition={{ x: 50, y: 100 + index * 80 }}
                >
                    <div className="absolute bg-zinc-900 text-white px-4 py-2 rounded-xl shadow-xl border border-zinc-700 max-w-md">

                    {item.type === "math" ? (() => {
                        const exprLatex = formatToLatex(item.expression);
                        const ansLatex = formatToLatex(item.answer);

                        return (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: `\\(\\LARGE{${exprLatex} = ${ansLatex}}\\)`
                                }}
                            />
                        );
                    })() : (
                        <p className="text-sm leading-relaxed">
                            {String(item.expression)} = <span className="font-bold">{String(item.answer)}</span>
                        </p>
                    )}

                    </div>
                </Draggable>
            ))}
        </>
    );
}