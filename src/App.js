import { useEffect, useRef, useState } from 'react';
import liff from '@line/liff';
import Webcam from "react-webcam";
import './App.css';
import './App.sass';
import aa from './image/aa.jpg';

const imageUrl = aa;
const scaleWeight = 1 / window.innerWidth
let lastTouchDistance = null;
let currentScale = 1
function App() {
  const canvasRef = useRef(null);
  const divRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // 加载图像
  const [image] = useState(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";  // 确保启用 CORS
    img.src = imageUrl;
    return img;
  });




  const stopDrag = () => {
    setIsDragging(false);
    lastTouchDistance = null;
  };

  // PC
  const startDrag = (event) => {
    setIsDragging(true);
    setDragStart({
      x: event.clientX - position.x,
      y: event.clientY - position.y
    });
  };

  const onDrag = (event) => {
    if (isDragging) {
      setPosition({
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y
      });
    }
  };

  const calculateDistance = (touch1, touch2) => {
    const dx = touch2.pageX - touch1.pageX;
    const dy = touch2.pageY - touch1.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Phone
  const startDrag_Phone = (event) => {
    setIsDragging(true);

    setDragStart({
      x: event.targetTouches[0].pageX - position.x,
      y: event.targetTouches[0].pageY - position.y
    });

    if (event.targetTouches.length === 2) {
      lastTouchDistance = (calculateDistance(event.targetTouches[0], event.targetTouches[1]));
    }
  };

  const onDrag_Phone = (event) => {


    if (event.targetTouches.length === 2) {
      const currentDistance = calculateDistance(event.targetTouches[0], event.targetTouches[1]);

      if (lastTouchDistance) {
        // 计算缩放比例
        const scaleChange = (currentDistance / lastTouchDistance);
        /*if (scaleChange > 1.5) {
          // 放大
          setScale(1.01)
          lastTouchDistance = currentDistance;
        }
        else if (scaleChange < 0.7) {
          // 缩小
          setScale(0.08)
          lastTouchDistance = currentDistance;
        }*/
        setScale(scaleChange)
        lastTouchDistance = currentDistance;
      }
    }
    else if (isDragging) {
      setPosition({
        x: event.targetTouches[0].pageX - dragStart.x,
        y: event.targetTouches[0].pageY - dragStart.y
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawImage = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (scale != 1) {
        ctx.scale(scale, scale);
        setScale(1)
      }

      ctx.drawImage(image, position.x, position.y);
    };

    image.onload = drawImage; // 确保图像已加载后进行绘制
    drawImage(); // 初始绘制图像

  }, [image, position, scale]);

    // 阻止滚动事件
    const preventScroll = (event) => {
      event.preventDefault();
    };

  useEffect(() => {
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

   

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  return (
    <div className="App">
      <div className='cVision'>v0.0.1</div>
      <div className='cMain'  ref={divRef}>
        <div className='cButton'>測試按鈕</div>
      </div>
      <canvas
        ref={canvasRef}
        width={800} // 设置画布的宽度和高度
        height={600}
        style={{ border: '1px solid black' }}
        // pc
        onMouseDown={startDrag}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onMouseMove={onDrag}
        // phone
        onTouchStart={startDrag_Phone}
        onTouchEnd={stopDrag}
        onTouchMove={onDrag_Phone}
      />
    </div>
  );
}

export default App;
