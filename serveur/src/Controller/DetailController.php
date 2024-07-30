<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Product;
use App\Entity\ProductLog;
use App\Entity\Stock;

class DetailController extends AbstractController
{
    #[Route('/detail/{id}', name: 'app_detail', methods:['GET'])]
    public function getDetail($id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $id = 1 ;
        $produit = $entityManager->getRepository(Product::class)->find($id);
        if($produit){
            try{
                $logs = $entityManager->getRepository(ProductLog::class)->findBy(['product' => $produit]);
                foreach ($logs as $log) {
                    $log->setVisitNumber($log->getVisitNumber() + 1);
                }
                $entityManager->flush();
                $data = [
                    'id' => $produit->getId(),
                    'name' => $produit->getName(),
                    'description' => $produit->getDescription(),
                    'price' => $produit->getPrice(),
                    'categorie' => $produit->getCategorie()->getName(),
                    'introduction' => $produit->getIntroduction(),
                    'stocks' => array_map(function (Stock $stock) {
                        return [
                            'id' => $stock->getId(),
                            'number' => $stock->getNumber(),
                        ];
                    }, $produit->getStocks()->toArray()),
                    'ingredients' => array_map(function ($ingredient) {
                        return [
                            'name' => $ingredient->getName(),
                            'piece' => $ingredient->getPiece(),
                        ];
                    }, $produit->getIngredients()->toArray()),
                ];
                // dd($data);
            }catch(\Exception $e){
                error_log($e->getMessage());
                return new JsonResponse(['status' => 'error', 'message' => "L'adresse mail est déjà utilisée, merci d'essayer de vous connecter.","data =>" => $data], JsonResponse::HTTP_BAD_REQUEST);
            }
            return new JsonResponse(['status' => 'success', 'data' => $data], JsonResponse::HTTP_OK);
        }else{
            return new JsonResponse(['status' => 'error', 'message' => 'Erreur est survenue'], JsonResponse::HTTP_BAD_REQUEST);
        }
    }
}