import { useEffect, useRef, useState } from "react";
import { Button } from "../Button/Button"


export function ImageCropper({ image, onClose, onDone }) {

    const [imgStyle, setImgStyle] = useState({})
    const imageRef = useRef(null)
    const [aspectRatio, setAspectRatio] = useState(null)
    const [position, setPosition] = useState({
        x: 0,
        y: 0
    })

    const [cropSize, setCropSize] = useState(window.innerWidth < 568 ? 180 : 300)
    const [imgWidthHeight, setImgWdHe] = useState({ width: cropSize, height: cropSize, })
    const [loading, setLoading] = useState(false)





    function handleLoadImage(e) {
        const img = e.target;
        const aspectRatio = img.naturalWidth / img.naturalHeight;


        if (aspectRatio > 1) {
            setAspectRatio('landscape')
            setImgStyle({
                height: `${cropSize}px`,
            })
        } else if (aspectRatio < 1) {
            setAspectRatio('portrait')
            setImgStyle({
                width: `${cropSize}px`,
            })
        } else if (aspectRatio === 1) {
            setAspectRatio('square')
            setImgStyle({
                width: `${cropSize}px`,
                height: `${cropSize}px`
            })
        }

    }

    useEffect(() => {
        function handleResize() {
            setCropSize(window.innerWidth < 768 ? 220 : 300);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize)
    }, [])


    useEffect(() => {

        if (!imageRef.current) return

        const image = imageRef.current

        setImgWdHe({
            width: image.width,
            height: image.height
        })
    }, [imgStyle])


    const [drag, setDrag] = useState(false)
    const [prevClient, setPrevClient] = useState({ x: 0, y: 0, })

    function handlePointerDown(e) {
        setDrag(true)
        setPrevClient({ x: e.clientX, y: e.clientY })
    }
    function handlePointerUp() {
        setDrag(false)
    }

    function handlePointerMove(e) {
        if (!drag) return;

        const deltaX = e.clientX - prevClient.x;
        const deltaY = e.clientY - prevClient.y;

        setPosition(prev => {
            let newX = prev.x + deltaX;
            let newY = prev.y + deltaY;

            const minX = 0;
            const maxX = imgWidthHeight.width - cropSize;

            const minY = 0;
            const maxY = imgWidthHeight.height - cropSize;


            newX = Math.max(minX, Math.min(maxX, newX));
            newY = Math.max(minY, Math.min(maxY, newY));

            return { x: newX, y: newY };
        });

        setPrevClient({
            x: e.clientX,
            y: e.clientY
        });
    }

    function handleFileConvert() {

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        const img = imageRef.current

        if (!img) return

        setLoading(true)

        canvas.width = cropSize
        canvas.height = cropSize

        context.clearRect(0, 0, cropSize, cropSize)

        const radius = cropSize / 2

        context.beginPath()
        context.arc(radius, radius, radius, 0, Math.PI * 2);
        context.closePath()
        context.clip()

        context.drawImage(
            img,
            -position.x,
            -position.y,
            imgWidthHeight.width,
            imgWidthHeight.height
        )


        canvas.toBlob(blob => {

            const file = new File([blob], 'avatar.png', {
                type: 'image/png'
            })

            if (file) {
                onDone(file)
            }

        })



    }


    return (
        <>
            <div className=" dash-scroll flex flex-col items-center absolute z-40 bg-[#131314] h-[500px] md:w-auto overflow-auto p-2 sm:p-8 md:p-12 gap-5">
                <div className='font-[Inter] text-white text-[15px] sm:text-2xl' >Customize your avatar.</div>

                <div className="relative border flex justify-center items-center">


                    <div
                        draggable='false'
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        style={{ top: position.y, left: position.x, width: `${cropSize}px`, height: `${cropSize}px` }}
                        className="absolute cursor-grab "
                    >
                        <div className="absolute inset-0 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_0_30px_rgba(0,0,0,0.6)]" />


                        <div draggable='false' className="absolute inset-0 rounded-full border-[3px] border-white/95 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]" />


                        <div draggable='false' className="absolute inset-[2px]  rounded-full border border-white/20" />
                    </div>


                    <img
                        onLoad={handleLoadImage}
                        style={{ ...imgStyle }}
                        ref={imageRef}
                        className={`select-none `}
                        src={image}
                        draggable="false"
                        alt="IMG NOT FOUND"
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={onClose}
                        className="flex items-center justify-center cursor-pointer p-1 md:p-2 w-[70px] md:w-[90px] bg-white text-[12px] md:text-[17px] text-black font-[Geist] font-semibold rounded-[3px] hover:bg-gray-200 transition-colors">
                        Cancel
                    </Button>

                    <Button
                        onClick={handleFileConvert}
                        loadingText={loading && 'Uploading...'}
                        className="flex items-center justify-center cursor-pointer p-1 md:p-2  w-[80px] md:w-[120px] bg-[#2d2e32] text-[12px] md:text-[17px] text-white font-[Geist] font-semibold rounded-[3px] hover:bg-[#3f4045] transition-colors">
                        Done
                    </Button>
                </div>

            </div>

        </>
    )
}

