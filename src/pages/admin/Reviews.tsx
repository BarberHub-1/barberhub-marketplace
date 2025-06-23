import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avaliacao } from '../../types';
import { avaliacaoService } from '../../services/avaliacao.service';
import { useToast } from '../../hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const StarRating = ({ nota }: { nota: number }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
            <span key={index} className={index < Math.round(nota) ? 'text-yellow-400' : 'text-gray-300'}>
                &#9733;
            </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">{nota.toFixed(1)}</span>
    </div>
);

// Novo componente para o filtro de estrelas
const StarFilter = ({ selectedNota, onNotaChange }: { selectedNota: number; onNotaChange: (nota: number) => void }) => {
    return (
        <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600 mr-2">Filtrar por nota:</span>
            {[...Array(5)].map((_, index) => {
                const notaValue = index + 1;
                return (
                    <button 
                        key={notaValue}
                        onClick={() => onNotaChange(notaValue === selectedNota ? 0 : notaValue)}
                        className="focus:outline-none"
                    >
                        <span className={`text-2xl transition-colors duration-200 ${notaValue <= selectedNota ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}>
                            &#9733;
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

const AdminReviews = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [notaFilter, setNotaFilter] = useState(0);

    useEffect(() => {
        loadAvaliacoes();
    }, []);

    const loadAvaliacoes = async () => {
        try {
            setLoading(true);
            const data = await avaliacaoService.getAll();
            setAvaliacoes(data);
        } catch (error) {
            toast({ title: "Erro", description: "Não foi possível carregar as avaliações.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const filteredAvaliacoes = avaliacoes.filter(avaliacao => {
        const matchesSearch = searchTerm === '' ||
            avaliacao.estabelecimentoNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            avaliacao.clienteNome?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesNota = notaFilter === 0 || Math.floor(avaliacao.nota) === notaFilter;

        return matchesSearch && matchesNota;
    });

    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
                        <p className="mt-2 text-gray-600">Você não tem permissão para acessar esta área.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Avaliações</h1>
                    <button onClick={() => navigate('/admin/dashboard')} className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                        Voltar ao Dashboard
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex gap-4 items-center">
                                <input
                                    type="text"
                                    placeholder="Buscar por estabelecimento ou cliente..."
                                    className="border rounded px-4 py-2 w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <StarFilter selectedNota={notaFilter} onNotaChange={setNotaFilter} />
                            </div>
                        </div>

                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">ID</th>
                                    <th className="text-left py-3 px-4">Estabelecimento</th>
                                    <th className="text-left py-3 px-4">Cliente</th>
                                    <th className="text-left py-3 px-4">Nota</th>
                                    <th className="text-left py-3 px-4">Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="py-3 px-4"><Skeleton className="h-5 w-10" /></td>
                                            <td className="py-3 px-4"><Skeleton className="h-5 w-32" /></td>
                                            <td className="py-3 px-4"><Skeleton className="h-5 w-32" /></td>
                                            <td className="py-3 px-4"><Skeleton className="h-5 w-24" /></td>
                                            <td className="py-3 px-4"><Skeleton className="h-5 w-24" /></td>
                                        </tr>
                                    ))
                                ) : !loading && filteredAvaliacoes.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-gray-500">Nenhuma avaliação encontrada.</td>
                                    </tr>
                                ) : (
                                    filteredAvaliacoes.map((avaliacao) => (
                                        <tr key={avaliacao.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">{avaliacao.id}</td>
                                            <td className="py-3 px-4">{avaliacao.estabelecimentoNome}</td>
                                            <td className="py-3 px-4">{avaliacao.clienteNome}</td>
                                            <td className="py-3 px-4"><StarRating nota={avaliacao.nota} /></td>
                                            <td className="py-3 px-4">{new Date(avaliacao.dataAvaliacao).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <div className="mt-6 flex justify-between items-center">
                            <div className="text-gray-600">
                                Mostrando 1-2 de 2 resultados
                            </div>
                            <div className="flex gap-2">
                                <button className="border rounded px-3 py-1 disabled:opacity-50" disabled>
                                    Anterior
                                </button>
                                <button className="border rounded px-3 py-1 disabled:opacity-50" disabled>
                                    Próxima
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReviews; 