<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Categorie;

class CategorieController extends AbstractController
{
    #[Route('/categorie', name: 'categorie', methods:['GET'])]
    public function searchCategorie(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $queryCategorie = $request->query->get('query', ''); 
        
        if (empty($queryCategorie)) {
            return new JsonResponse(['status' => 'error', 'message' => 'mauvaise requete'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $categorie = $entityManager->getRepository(Categorie::class)->createQueryBuilder('c')
            ->where('c.name LIKE :query')
            ->setParameter('query', '%' . $queryCategorie . '%')
            ->getQuery()
            ->getResult();

        $data = array_map(fn(Categorie $categorie) => $categorie->toArray(), $categorie);
        
        return new JsonResponse(['status' => 'success', 'data' => $data], JsonResponse::HTTP_OK);
    }
}