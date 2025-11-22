import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import '@styles/styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// inactive queries stay 5min according to gemini ("gcTime")
export const useQueryClientObj = new QueryClient({
    defaultOptions: {
        queries: {}
    }
});

const persister = createAsyncStoragePersister ({
    storage: localStorage
})

createRoot(document.getElementById('root')!).render(
    <PersistQueryClientProvider
        client={useQueryClientObj}
        persistOptions={{persister: persister}}
    >
        <App />
        
        <ReactQueryDevtools />
    </PersistQueryClientProvider>
)
