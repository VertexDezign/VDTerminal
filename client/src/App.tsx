import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import Gauge from './components/Gauge'
import ProgressBar from './components/ProgressBar'
import { 
  Menu, Search, Plus, Minus, Satellite, 
  Settings, Fuel, Thermometer, Clock, 
  Lightbulb, Zap, Anchor, Layers, 
  Video, Map, Tractor, ChevronUp, ChevronDown
} from 'lucide-react'

const socket = io('http://localhost:3001')

function App() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    socket.on('ggi-data', (receivedData) => {
      setData(receivedData)
    })
    return () => {
      socket.off('ggi-data')
    }
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[--color-fendt-light]">
        <div className="text-2xl font-bold animate-pulse text-[--color-fendt-green]">FENDT LOADING...</div>
      </div>
    )
  }

  const vehicle = data.GGI.vehicle
  const motor = vehicle.motor
  const environment = data.GGI.environment

  const getVal = (obj: any) => {
    if (obj === null || obj === undefined) return 0;
    if (typeof obj === 'object') return obj['#text'] || 0;
    return obj;
  }

  return (
    <div className="min-h-screen bg-[var(--color-fendt-light)] flex flex-col font-sans select-none overflow-hidden h-screen">
      {/* Green Header */}
      <header className="bg-[var(--color-fendt-green)] text-white p-2 px-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-6">
          <Menu className="w-6 h-6 cursor-pointer" />
          <div className="text-2xl font-bold tabular-nums">{environment.time}</div>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-1">
             <span className="text-xs text-green-100">X:</span>
             <span className="text-sm font-bold">1047</span>
             <span className="text-xs text-green-100 ml-2">Y:</span>
             <span className="text-sm font-bold">1915</span>
           </div>
           <div className="text-3xl font-black italic tracking-tighter">FENDT™</div>
           <div className="flex items-center gap-4 text-xs font-bold">
              <span>TEMP: DAY <span className="text-base ml-1">68</span></span>
              <span>NIGHT <span className="text-base ml-1">46</span></span>
              <span className="uppercase ml-2">Sep</span>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <Search className="w-5 h-5" />
           <Minus className="w-5 h-5 border border-white/30 rounded" />
           <Plus className="w-5 h-5 border border-white/30 rounded" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-2 grid grid-cols-3 gap-2 overflow-hidden">
        {/* Top Left: Front Hitch */}
        <FendtPanel title="Front Hitch" icon={<Anchor size={16} />}>
          <div className="flex justify-between h-full">
            <div className="flex flex-col justify-between py-2">
               <div className="text-sm font-bold text-gray-400">91.7%</div>
               <Gauge label="" value={92} min={0} max={100} unit="%" size={110} />
            </div>
            <div className="flex flex-col gap-2 w-20">
               <div className="bg-white p-1 border rounded shadow-sm text-[10px] font-bold text-center">EXTRA 732 FT</div>
               <StatusIconButton icon={<ChevronUp />} active={true} color="green" />
               <StatusIconButton icon={<Layers />} />
               <StatusIconButton icon={<ChevronDown />} />
            </div>
            <div className="flex items-end pb-2">
              <ProgressBar label="" value={80} capacity={100} unit="%" vertical={true} />
            </div>
          </div>
        </FendtPanel>

        {/* Top Center: Engine and Transmission */}
        <FendtPanel title="Engine and Transmission" icon={<Tractor size={16} />}>
           <div className="flex flex-col items-center h-full relative">
              <div className="text-[8px] font-bold text-gray-400 uppercase mb-1">Press speedometer for cruise control</div>
              <div className="flex justify-between w-full px-4 absolute top-8">
                 <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center">
                       <Minus size={14} />
                    </div>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center">
                       <Plus size={14} />
                    </div>
                 </div>
              </div>
              <Gauge label="" value={getVal(vehicle.speed)} min={0} max={60} unit={vehicle.speed.unit} size={130} />
              
              <div className="grid grid-cols-2 w-full mt-2 gap-x-8 text-center">
                 <div>
                    <div className="text-[8px] font-bold text-gray-400 uppercase">FUEL/HR</div>
                    <div className="text-xl font-bold text-gray-700">7.7</div>
                 </div>
                 <div>
                    <div className="text-[8px] font-bold text-gray-400 uppercase">DEF/HR</div>
                    <div className="text-xl font-bold text-gray-700">0.6</div>
                 </div>
                 <div className="mt-2">
                    <div className="text-[8px] font-bold text-gray-400 uppercase">RPM</div>
                    <div className="text-2xl font-bold text-gray-700">{getVal(motor.rpm)}</div>
                 </div>
                 <div className="mt-2">
                    <div className="text-[8px] font-bold text-gray-400 uppercase">WATER</div>
                    <div className="text-2xl font-bold text-gray-700">{getVal(motor.temperatur)}</div>
                 </div>
              </div>
              
              <div className="mt-2 flex items-center gap-1 bg-gray-200 p-1 rounded">
                 <Tractor size={14} className="text-[var(--color-fendt-green)]" />
                 <div className="w-4 h-2 bg-[var(--color-fendt-green)] rounded-sm"></div>
              </div>
           </div>
        </FendtPanel>

        {/* Top Right: Rear Hitch */}
        <FendtPanel title="Rear Hitch" icon={<Anchor size={16} />}>
          <div className="flex justify-between h-full">
            <div className="flex items-end pb-2">
              <ProgressBar label="" value={65} capacity={100} unit="%" vertical={true} />
            </div>
            <div className="flex flex-col gap-2 w-20">
               <div className="bg-white p-1 border rounded shadow-sm text-[10px] font-bold text-center">EXTRA 7100T</div>
               <StatusIconButton icon={<ChevronUp />} active={true} color="green" />
               <StatusIconButton icon={<Layers />} />
               <StatusIconButton icon={<ChevronDown />} />
            </div>
            <div className="flex flex-col justify-between py-2">
               <div className="text-sm font-bold text-gray-400 text-right">94.4%</div>
               <Gauge label="" value={94} min={0} max={100} unit="%" size={110} />
            </div>
          </div>
        </FendtPanel>

        {/* Bottom Left: Lighting */}
        <FendtPanel title="Lighting" icon={<Lightbulb size={16} />}>
           <div className="relative h-full">
              <div className="text-sm font-bold text-gray-400">98.6%</div>
              <div className="flex justify-around mt-4">
                 <StatusIconButton icon={<Lightbulb size={24} />} round={true} active={vehicle.lights?.light.lowBeam === 'true'} />
                 <StatusIconButton icon={<Lightbulb size={24} />} round={true} active={vehicle.lights?.light.highBeam === 'true'} />
                 <StatusIconButton icon={<Lightbulb size={24} />} round={true} active={vehicle.lights?.beaconLight === 'true'} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                 <Tractor size={120} className="text-gray-300 opacity-50" />
              </div>
           </div>
        </FendtPanel>

        {/* Bottom Center: Tools */}
        <FendtPanel title="Front Tool | Rear Tool" icon={<Settings size={16} />}>
           <div className="grid grid-cols-2 h-full gap-2 py-1">
              {/* Front Tool Status */}
              <div className="flex flex-col gap-1 border-r border-gray-300 pr-1">
                 <div className="bg-orange-500 text-white p-2 rounded flex flex-col items-center">
                    <Anchor size={20} />
                    <span className="text-[8px] font-black uppercase mt-1">Attached</span>
                 </div>
                 <div className="bg-blue-500 text-white p-2 rounded flex flex-col items-center">
                    <Layers size={20} />
                    <span className="text-[8px] font-black uppercase mt-1">Unfolded</span>
                 </div>
                 <div className="h-2 bg-yellow-400 rounded-full mt-1"></div>
                 <div className="bg-gray-100 p-2 rounded border flex flex-col items-center mt-auto">
                    <span className="text-[8px] font-black uppercase">Raised</span>
                 </div>
              </div>
              {/* Rear Tool Status */}
              <div className="flex flex-col gap-1">
                 <div className="bg-red-600 text-white p-2 rounded flex flex-col items-center">
                    <Anchor size={20} />
                    <span className="text-[8px] font-black uppercase mt-1">Attached</span>
                 </div>
                 <div className="bg-green-600 text-white p-2 rounded flex flex-col items-center">
                    <Layers size={20} />
                    <span className="text-[8px] font-black uppercase mt-1">Unfolded</span>
                 </div>
                 <div className="h-2 bg-purple-600 rounded-full mt-1"></div>
                 <div className="bg-gray-100 p-2 rounded border flex flex-col items-center mt-auto">
                    <span className="text-[8px] font-black uppercase">Off</span>
                 </div>
              </div>
           </div>
        </FendtPanel>

        {/* Bottom Right: Operations */}
        <FendtPanel title="Operations" icon={<Zap size={16} />}>
           <div className="grid grid-cols-3 gap-2">
              <StatusIconButton icon={<Zap />} active={true} color="green" />
              <StatusIconButton icon={<Fuel />} />
              <StatusIconButton icon={<Tractor />} />
              <StatusIconButton icon={<ChevronUp />} />
              <StatusIconButton icon={<ChevronUp />} />
              <StatusIconButton icon={<Map />} active={true} color="green" />
              <StatusIconButton icon={<Settings />} />
              <StatusIconButton icon={<Tractor />} />
              <StatusIconButton icon={<Video />} />
           </div>
        </FendtPanel>
      </main>

      {/* Black Footer Status Bar */}
      <footer className="bg-black text-white p-2 px-6 flex justify-between items-center h-14">
        <div className="flex items-center gap-10">
          <Satellite className="w-6 h-6 text-gray-400" />
          <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center">
            <Tractor className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xs font-bold text-gray-500">A ... B</div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-0.5 bg-gray-600"></div>)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12">
           <div className="flex flex-col items-center">
              <div className="text-xs font-bold text-gray-400">90°</div>
              <div className="w-6 h-6 rounded-full border border-green-500 flex items-center justify-center">
                 <div className="w-0.5 h-4 bg-green-500 transform rotate-45"></div>
              </div>
           </div>
           <div className="w-8 h-8 flex flex-col justify-between py-1">
              <div className="h-0.5 w-full bg-gray-600"></div>
              <div className="h-0.5 w-full bg-gray-300"></div>
              <div className="h-0.5 w-full bg-gray-600"></div>
           </div>
           <div className="text-3xl font-bold">N</div>
           <div className="text-4xl font-black tabular-nums">{getVal(vehicle.speed)}</div>
           <div className="flex items-center gap-2">
              <Fuel className="text-gray-400" size={20} />
              <div className="h-6 w-1 bg-white"></div>
           </div>
        </div>

        <div className="flex flex-col items-end text-[10px] font-bold uppercase text-gray-400 leading-tight">
          <div>Fendt</div>
          <div>1050</div>
        </div>
      </footer>
    </div>
  )
}

function FendtPanel({ title, children, icon }: { title: string, children: React.ReactNode, icon?: React.ReactNode }) {
  return (
    <div className="bg-[var(--color-fendt-panel)] border border-gray-300 rounded shadow-sm flex flex-col overflow-hidden">
      <div className="p-1 px-3 border-b border-gray-200 flex justify-between items-center bg-white/50">
        <div className="flex items-center gap-2 text-gray-500">
           {icon}
           <span className="text-[11px] font-bold uppercase tracking-tight">{title}</span>
        </div>
        <div className="flex gap-1">
           <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-300"></div>
        </div>
      </div>
      <div className="flex-1 p-2 relative">
        {children}
      </div>
    </div>
  )
}

function StatusIconButton({ icon, active = false, color = "white", round = false }: { icon: React.ReactNode, active?: boolean, color?: "white" | "green", round?: boolean }) {
  const baseClasses = `flex items-center justify-center border shadow-sm transition-all ${round ? 'rounded-full w-12 h-12' : 'rounded w-full h-12'}`
  const activeClasses = active 
    ? (color === "green" ? "bg-gradient-to-b from-[var(--color-fendt-accent)] to-[var(--color-fendt-green)] text-white border-[var(--color-fendt-green)]" : "bg-white text-[var(--color-fendt-green)] border-gray-300")
    : "bg-gradient-to-b from-gray-100 to-gray-200 text-gray-500 border-gray-300"
  
  return (
    <div className={`${baseClasses} ${activeClasses}`}>
      {icon}
    </div>
  )
}

export default App
