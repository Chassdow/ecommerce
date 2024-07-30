<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Entity\UserLog;
use App\Entity\Categorie;

class AdminController extends AbstractController
{
    #[Route('/admin/', name: 'admin_search_users', methods: ['GET'])]
    public function searchUsers(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $query = $request->query->get('query');

        if (!$query) {
            return new JsonResponse(['status' => 'error', 'message' => 'No query provided'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $users = $entityManager->getRepository(User::class)->createQueryBuilder('u')
            ->where('u.firstname LIKE :query OR u.lastname LIKE :query OR u.email LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->getQuery()
            ->getResult();

        $userArray = [];
        foreach ($users as $user) {
            $userArray[] = [
                'id' => $user->getId(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'email' => $user->getEmail(),
                'phone' => $user->getPhone(),
                'roles' => $user->getRoles(), 
            ];
        }

        return new JsonResponse(['status' => 'success', 'data' => $userArray], JsonResponse::HTTP_OK);
    }

    #[Route('/admin/{id}', name: 'admin_delete_user', methods: ['DELETE'])]
    public function deleteUser(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $entityManager->getRepository(User::class)->find($id);

        if ($user) {
            $userLogs = $entityManager->getRepository(UserLog::class)->findBy(['user' => $user]);

            foreach ($userLogs as $userLog) {
                $entityManager->remove($userLog);
            }

            $entityManager->remove($user);
            $entityManager->flush();

            return new JsonResponse(['status' => 'success', 'data' => 'User supprimé correctement'], JsonResponse::HTTP_OK);
        } else {
            return new JsonResponse(['error' => 'Aucun user'], JsonResponse::HTTP_NOT_FOUND);
        }
    }

    #[Route('/admin/categories', name: 'admin_get_categories', methods: ['GET'])]
    public function getCategories(EntityManagerInterface $entityManager): JsonResponse
    {
        $categories = $entityManager->getRepository(Categorie::class)->findAll();
        $categoryArray = [];

        foreach ($categories as $category) {
            $categoryArray[] = [
                'id' => $category->getId(),
                'name' => $category->getName(),
            ];
        }

        return new JsonResponse(['status' => 'success', 'data' => $categoryArray], JsonResponse::HTTP_OK);
    }

    #[Route('/admin/categories', name: 'admin_add_category', methods: ['POST'])]
    public function addCategory(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['name'])) {
            return new JsonResponse(['status' => 'error', 'message' => 'No name provided'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $category = new Categorie();
        $category->setName($data['name']);

        $entityManager->persist($category);
        $entityManager->flush();

        return new JsonResponse(['status' => 'success', 'data' => ['id' => $category->getId(), 'name' => $category->getName()]], JsonResponse::HTTP_CREATED);
    }

    #[Route('/admin/categories/{id}', name: 'admin_delete_category', methods: ['DELETE'])]
    public function deleteCategory(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $category = $entityManager->getRepository(Categorie::class)->find($id);

        if ($category) {
            $entityManager->remove($category);
            $entityManager->flush();

            return new JsonResponse(['Category supprimée correctement'], JsonResponse::HTTP_OK);
        } else {
            return new JsonResponse(['Aucune catégorie trouvée'], JsonResponse::HTTP_NOT_FOUND);
        }
    }
}

