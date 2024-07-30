<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Product;

class ProduitController extends AbstractController
{
    #[Route('/produit', name: 'app_produit', methods:['GET'])]
    public function getProduct(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $produit = $entityManager->getRepository(Product::class)->findAll();
        
        $data = array_map(fn(Product $product) => $product->toArray(), $produit);
        
        return new JsonResponse(['status' => 'success', 'data' => $data], JsonResponse::HTTP_OK);
    }

    #[Route('/produitRecherche', name: 'app_produitRecherche', methods:['GET'])]
    public function searchProduct(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $queryProduct = $request->query->get('query', ''); 
        
        if (empty($queryProduct)) {
            return new JsonResponse(['status' => 'error', 'message' => 'mauvaise requete'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $produit = $entityManager->getRepository(Product::class)->createQueryBuilder('p')
            ->where('p.name LIKE :query')
            ->setParameter('query', '%' . $queryProduct . '%')
            ->getQuery()
            ->getResult();

        $data = array_map(fn(Product $product) => $product->toArray(), $produit);
        
        return new JsonResponse(['status' => 'success', 'data' => $data], JsonResponse::HTTP_OK);
    }
}
